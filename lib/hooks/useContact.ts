import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'
import { CreateContactRequest, UpdateContactRequest } from '../api/types'

export const useContact = (params?: { subId?: number | null; userId?: number | null; recipientId?: number | null }) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['contacts', params],
    queryFn: () => apiClient.getContacts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })

  const createContact = useMutation({
    mutationFn: (data: CreateContactRequest) => apiClient.createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    }
  })

  const updateContact = useMutation({
    mutationFn: (data: UpdateContactRequest) => apiClient.updateContact(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      queryClient.invalidateQueries({ queryKey: ['contact', variables.id] })
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

export const useContactById = (id: number) => {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => apiClient.getContact(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}