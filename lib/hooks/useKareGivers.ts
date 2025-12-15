import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'

export const useKareGivers = () => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['kare-givers'],
    queryFn: () => apiClient.getKareGivers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })

  const createKareGiver = useMutation({
    mutationFn: apiClient.createKareGiver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kare-givers'] })
    }
  })

  const updateKareGiver = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & any) => 
      apiClient.updateKareGiver(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kare-givers'] })
    }
  })

  const deleteKareGiver = useMutation({
    mutationFn: (id: number) => apiClient.deleteKareGiver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kare-givers'] })
    }
  })

  return {
    ...query,
    createKareGiver,
    updateKareGiver,
    deleteKareGiver,
  }
}