import { Helmet } from 'react-helmet-async'
import AddPlantForm from '../../../components/Form/AddPlantForm'
import { imageUpload } from '../../../api/utils'
import useAuth from '../../../hooks/useAuth'
import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddPlant = () => {
  const { user } = useAuth()
  const [uploadImage, setUploadImage] = useState('Upload Image')
  const [loading, setLoading] = useState(false)
  const navigate=useNavigate()

  const handleSubmit = async e => {
    setLoading(true)
    e.preventDefault()
    const from = e.target;
    const name = from.name.value;
    const description = from.description.value;
    const category = from.category.value;
    const price = parseFloat(from.price.value);
    const quantity = parseInt(from.quantity.value);
    const image = from.image.files[0];
    const imageUrl = await imageUpload(image);

    // Seller information
    const seller = {
      email: user?.email,
      name: user?.displayName,
      photo: user?.photoURL,
    }

    const plantData = {
      name, description, category, price, quantity, image: imageUrl, seller

    }
    // Save data db
    try {
      await axios.post(`${import.meta.env.VITE_lOCALHOST_URL}/plants`, plantData)
      toast.success('Data Added Successfully')
      navigate('/dashboard/my-inventory')
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm loading={loading} handleSubmit={handleSubmit} uploadImage={uploadImage} setUploadImage={setUploadImage} />
    </div>
  )
}

export default AddPlant
