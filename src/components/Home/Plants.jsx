import Card from './Card'
import Container from '../Shared/Container'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import LoadingSpinner from '../Shared/LoadingSpinner'

const Plants = () => {
  const { data: plants = [], isLoading } = useQuery({
    queryKey: ['plants'],
    queryFn: async () => {
      const { data } = await axios(`${import.meta.env.VITE_lOCALHOST_URL}/plants`)
      return data
    }
  })
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>
  }
  return (
    <Container>
      {
        plants && plants.length ? 
        <div className='pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
          {
            plants.map(plants=><Card key={plants._id} plants={plants}/>)
          }
        </div> : 'No Plants Available'
      }
    </Container>
  )
}

export default Plants
