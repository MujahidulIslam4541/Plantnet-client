/* eslint-disable react/prop-types */
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { Fragment, useState } from 'react'
import Button from '../Shared/Button/Button'
import useAuth from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../Form/CheckOutFom'
const stripPromise = loadStripe(import.meta.env.VITE_STRIP_PUBLIC_KEY)

const PurchaseModal = ({ closeModal, isOpen, plantsDetails, refetch }) => {
  const { user } = useAuth()
  const { name, category, quantity, price, seller, _id } = plantsDetails
  const [totalQuantity, SetTotalQuantity] = useState(1)
  const [purchasePrice, setPurchasePrice] = useState(price)
  const [purchaseInfo, setPurchaseInfo] = useState({
    // Save customer data
    customer: {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL
    },
    plantId: _id,
    quantity: totalQuantity,
    price: purchasePrice,
    address: '',
    seller: seller?.email,
    status: 'pending'
  })

  // Handle Plant Quantity
  const handleQuantity = (value) => {
    if (value > quantity) {
      SetTotalQuantity(quantity)
      return toast.error("Quantity extends available stock")
    }
    if (value < 0) {
      SetTotalQuantity(1)
      return toast.error("Quantity Can't be less than  1")
    }
    SetTotalQuantity(value)
    setPurchasePrice(value * price)
    setPurchaseInfo(prv => {
      return { ...prv, quantity: value, price: value * price }
    })
  }


  // Total Price Calculation
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <DialogTitle
                  as='h3'
                  className='text-lg font-medium text-center leading-6 text-gray-900'
                >
                  Review Info Before Purchase
                </DialogTitle>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Plant: {name}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Category: {category}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Customer: {user?.displayName}</p>
                </div>

                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Price: $ {price}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Available Quantity: {quantity}</p>
                </div>
                {/* Quantity */}
                <div className='space-x-2 mt-2 text-sm'>
                  <label htmlFor='quantity' className=' text-gray-600'>
                    Quantity :
                  </label>
                  <input
                    value={totalQuantity}
                    onChange={(e) => handleQuantity(parseInt(e.target.value))}
                    className='p-2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                    name='quantity'
                    id='quantity'
                    type='number'
                    placeholder='Available quantity'
                    required
                  />
                </div>
                {/* Address */}
                <div className='space-x-2 mt-2 text-sm'>
                  <label htmlFor='quantity' className=' text-gray-600'>
                    Address :
                  </label>
                  <input
                    onChange={(e) => setPurchaseInfo(prv => {
                      return { ...prv, address: e.target.value }
                    })}
                    className='p-2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                    name='Address'
                    id='Address'
                    type='text'
                    placeholder='Write Your Address Here...'
                    required
                  />
                </div>

                {/* Payment method input */}
                <Elements stripe={stripPromise}>
                  {/* CheckOut Form */}
                  <CheckoutForm purchaseInfo={purchaseInfo} closeModal={closeModal} refetch={refetch} totalQuantity={totalQuantity}></CheckoutForm>
                </Elements>


              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default PurchaseModal
