
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

import './CheckOutForm.css';
import Button from '../Shared/Button/Button';
import { FcCancel } from 'react-icons/fc';
import { useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ purchaseInfo, closeModal, refetch, totalQuantity }) => {
  const axiosSecure = useAxiosSecure()
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('')
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)




  useEffect(() => {
    getPaymentIntent()

  }, [purchaseInfo])
  const getPaymentIntent = async () => {
    try {
      const { data } = await axiosSecure.post(`/create-payment-intent`,
        { quantity: purchaseInfo?.quantity, plantId: purchaseInfo?.plantId })
      setClientSecret(data?.clientSecret)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (event) => {
    setProcessing(true)
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);

    if (card == null) {
      setProcessing(false)
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      setProcessing(false)
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
    }

    // confirm card payment method
    const {paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: purchaseInfo?.customer?.name,
          email: purchaseInfo?.customer?.email
        },
      },
    })
    console.log(paymentIntent)
    if (paymentIntent.status === 'succeeded') {
      try {
        await axiosSecure.post('/order', { ...purchaseInfo, transactionId: paymentIntent?.id })
        // decrease quantity 
        await axiosSecure.patch(`/order/quantity/${purchaseInfo?.plantId}`, { UpdateQuantity: totalQuantity, status: 'decrease' })
        toast.success(" Order Successful!")
        navigate('/dashboard/my-orders')
        refetch()
      }
      catch (error) {
        console.log(error)
      }
      finally {
        closeModal()
        setProcessing(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      {/* Purchase button */}

      <div className='flex gap-10'>
        <Button type="submit" disabled={!stripe || processing || !clientSecret} label={`pay ${purchaseInfo?.price}$`}></Button>
        <Button outline={true} onClick={closeModal} label={`Cancel`}> </Button>
      </div>


    </form>
  );
}; export default CheckoutForm;