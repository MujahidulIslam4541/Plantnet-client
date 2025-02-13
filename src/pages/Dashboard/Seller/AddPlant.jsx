import { Helmet } from 'react-helmet-async'
import AddPlantForm from '../../../components/Form/AddPlantForm'
import { imageUpload } from '../../../api/utils'
import useAuth from '../../../hooks/useAuth'

const AddPlant = () => {
  const { user } = useAuth()
  const handleSubmit = async e => {
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
    console.table(plantData)
  }
  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm handleSubmit={handleSubmit} />
    </div>
  )
}

export default AddPlant
