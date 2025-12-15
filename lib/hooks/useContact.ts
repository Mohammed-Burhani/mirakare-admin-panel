import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'

export const useContact = () => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['contacts'],
    queryFn: () => apiClient.getContacts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })

  const createContact = useMutation({
    mutationFn: apiClient.createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    }
  })

  const updateContact = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & any) => 
      apiClient.updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    }
  })

  const deleteContact = useMutation({
    mutationFn: (id: number) => apiClient.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    }
  })

  return {
    ...query,
    createContact,
    updateContact,
    deleteContact,
  }
}