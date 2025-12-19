import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'

export const useMasterValues = (type: number) => {
  return useQuery({
    queryKey: ['master-values', type],
    queryFn: () => apiClient.getMasterValues(type),
    enabled: !!type,
    staleTime: 10 * 60 * 1000, // 10 minutes - master values don't change often
    retry: 1
  })
}