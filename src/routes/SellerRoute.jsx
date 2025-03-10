import React from 'react'
import useRole from '../hooks/useRole'
import LoadingSpinner from '../components/Shared/LoadingSpinner'
import { Navigate } from 'react-router-dom'

function SellerRoute({ children }) {
    const [role, isLoading] = useRole()

    if (isLoading) return <LoadingSpinner />
    if (role === 'seller') return children
    return <Navigate to='/dashboard' state={{ from: location }} replace='true' />
}


export default SellerRoute
