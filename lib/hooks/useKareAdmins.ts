import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'

export const useKareAdmins = () => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['kare-admins'],
    queryFn: () => apiClient.getKareAdmins(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })

  const createKareAdmin = useMutation({
    mutationFn: apiClient.createKareAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kare-admins'] })
    }
  })

  const updateKareAdmin = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & any) => 
      apiClient.updateKareAdmin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kare-admins'] })
    }
  })

  const deleteKareAdmin = useMutation({
    mutationFn: (id: number) => apiClient.deleteKareAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kare-admins'] })
    }
  })

  return {
    ...query,
    createKareAdmin,
    updateKareAdmin,
    deleteKareAdmin,
  }
}