import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'

export const useKareViewers = () => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['kare-viewers'],
    queryFn: () => apiClient.getKareViewers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })

  const createKareViewer = useMutation({
    mutationFn: apiClient.createKareViewer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kare-viewers'] })
    }
  })

  const updateKareViewer = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & any) => 
      apiClient.updateKareViewer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kare-viewers'] })
    }
  })

  const deleteKareViewer = useMutation({
    mutationFn: (id: number) => apiClient.deleteKareViewer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kare-viewers'] })
    }
  })

  return {
    ...query,
    createKareViewer,
    updateKareViewer,
    deleteKareViewer,
  }
}