import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from '../api/apiClient'
import { CreateSubscriberRequest, UpdateSubscriberRequest } from '../api/types'

// Subscriber Types (based on the dropdown in the image)
export const SUBSCRIBER_TYPES = [
  { id: "family", name: "Family" },
  { id: "organization", name: "Organization" },
]

// Custom hook
export function useSubscribers(type?: string | null) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['subscribers', type],
    queryFn: () => apiClient.getSubscribers(type || null),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateSubscriberRequest) => apiClient.createSubscriber(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateSubscriberRequest) => apiClient.updateSubscriber(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteSubscriber(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] })
    },
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createSubscriber: createMutation,
    updateSubscriber: updateMutation,
    deleteSubscriber: deleteMutation,
  }
}

// Hook for getting a single subscriber
export function useSubscriber(id: number) {
  return useQuery({
    queryKey: ["subscriber", id],
    queryFn: () => apiClient.getSubscriber(id),
    enabled: !!id,
  })
}