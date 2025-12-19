import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'
import { CreateKareRecipientRequest } from '../api/types'

export const useKareRecipients = () => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['kare-recipients'],
    queryFn: () => apiClient.getKareRecipients(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })

  const createKareRecipient = useMutation({
    mutationFn: (data: CreateKareRecipientRequest) => apiClient.createKareRecipient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kare-recipients'] })
    }
  })

  const updateKareRecipient = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<CreateKareRecipientRequest>) => 
      apiClient.updateKareRecipient(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['kare-recipients'] })
      queryClient.invalidateQueries({ queryKey: ['kare-recipient', variables.id] })
    }
  })

  const deleteKareRecipient = useMutation({
    mutationFn: (id: number) => apiClient.deleteKareRecipient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kare-recipients'] })
    }
  })

  return {
    ...query,
    createKareRecipient,
    updateKareRecipient,
    deleteKareRecipient,
  }
}
export const useKareRecipient = (id: number) => {
  return useQuery({
    queryKey: ['kare-recipient', id],
    queryFn: () => apiClient.getKareRecipient(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

export const useKareRecipientsDropdown = () => {
  return useQuery({
    queryKey: ['kare-recipients-dropdown'],
    queryFn: () => apiClient.getKareRecipientsForDropdown(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}