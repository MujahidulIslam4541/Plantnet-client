import PropTypes from 'prop-types'
import { useState } from 'react'
import DeleteModal from '../../Modal/DeleteModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
const SellerOrderDataRow = ({ order, refetch }) => {
  const { name, customer, price, quantity, address, status, _id, plantId } = order || {}
  let [isOpen, setIsOpen] = useState(false)
  const closeModal = () => setIsOpen(false)
  const axiosSecure = useAxiosSecure()


  // Order deleted By Seller
  const handleDeleteOrder = async () => {
    try {
      await axiosSecure.delete(`/order-delete/${_id}`)
      // decrease quantity 
      await axiosSecure.patch(`/order/quantity/${plantId}`, { UpdateQuantity: quantity, status: 'increase' })
      toast.success(" Order cancel Successful!")
      refetch()
    }
    catch (error) {
      toast.error(error.response.data)
    }
    finally {
      closeModal()
    }
  }

  // Order ManageMent by seller
  const handleStatus = async (newStatus) => {
    if (status === newStatus) return
    try {
      await axiosSecure.patch(`/orders/${_id}`, { status: newStatus })
      toast.success(" Status Updated Successful!")
      refetch()
    }
    catch (error) {
      toast.error(error.response.data)
    }
  }
  return (
    <tr>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{name}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{customer?.email}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>${price}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{quantity}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{address}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{status}</p>
      </td>

      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <div className='flex items-center gap-2'>
          <select
            required
            onChange={(e) => handleStatus(e.target.value)}
            defaultValue={status}
            disabled={status == 'Delivered'}
            className='p-1 border-2 border-lime-300 focus:outline-lime-500 rounded-md text-gray-900 whitespace-no-wrap bg-white'
            name='category'
          >
            <option value='Pending'>Pending</option>
            <option value='In Progress'>Start Processing</option>
            <option value='Delivered'>Deliver</option>
          </select>
          <button
            onClick={() => setIsOpen(true)}
            className='relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'
          >
            <span
              aria-hidden='true'
              className='absolute inset-0 bg-red-200 opacity-50 rounded-full'
            ></span>
            <span className='relative'>Cancel</span>
          </button>
        </div>
        <DeleteModal handleDeleteOrder={handleDeleteOrder} isOpen={isOpen} closeModal={closeModal} />
      </td>
    </tr>
  )
}

SellerOrderDataRow.propTypes = {
  order: PropTypes.object,
  refetch: PropTypes.func,
}

export default SellerOrderDataRow
