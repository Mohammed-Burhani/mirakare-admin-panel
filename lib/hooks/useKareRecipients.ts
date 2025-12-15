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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kare-recipients'] })
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