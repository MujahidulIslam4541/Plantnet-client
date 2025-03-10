import React from 'react'
import useAuth from './useAuth'
import useAxiosSecure from './useAxiosSecure'
import { useQueries, useQuery } from '@tanstack/react-query'

export default function useRole() {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()
    const { data: role, isLoading } = useQuery({
        queryKey: ['role', user?.email],
        queryFn: async () => {
            const { data } = await axiosSecure(`/user/role/${user?.email}`)
            return data.role
        }
    })
    return [role, isLoading]
}
