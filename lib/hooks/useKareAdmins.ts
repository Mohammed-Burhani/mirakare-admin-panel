import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'
import { CreateKareAdminRequest } from '../api/types'

export const useKareAdmins = () => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['kare-admins'],
    queryFn: () => apiClient.getKareAdmins(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })

  const createKareAdmin = useMutation({
    mutationFn: (data: CreateKareAdminRequest) => apiClient.createKareAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kare-admins'] })
    }
  })

  const updateKareAdmin = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<CreateKareAdminRequest>) => 
      apiClient.updateKareAdmin(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['kare-admins'] })
      queryClient.invalidateQueries({ queryKey: ['kare-admin', variables.id] })
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
export const useKareAdmin = (id: number) => {
  return useQuery({
    queryKey: ['kare-admin', id],
    queryFn: () => apiClient.getKareAdmin(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}