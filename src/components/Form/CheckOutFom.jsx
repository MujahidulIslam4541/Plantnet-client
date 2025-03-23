
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

import './CheckOutForm.css';
import Button from '../Shared/Button/Button';
import { FcCancel } from 'react-icons/fc';

const CheckoutForm = ({ purchaseInfo, closeModal, refetch }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
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
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
    }
  };

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
        <Button type="submit" disabled={!stripe} label={`pay ${'10'}$`}></Button>
        <Button outline={true} onClick={closeModal} label={`Cancel`}> </Button>
      </div>


    </form>
  );
}; export default CheckoutForm;