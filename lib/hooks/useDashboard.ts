import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiClient.getDashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}