import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'
import { CreateKareGiverRequest } from '../api/types'

export const useKareGivers = () => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['kare-givers'],
    queryFn: () => apiClient.getKareGivers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })

  const createKareGiver = useMutation({
    mutationFn: (data: CreateKareGiverRequest) => apiClient.createKareGiver(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kare-givers'] })
    }
  })

  const updateKareGiver = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<CreateKareGiverRequest>) => 
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