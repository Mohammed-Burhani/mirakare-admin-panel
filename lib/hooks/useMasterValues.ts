import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'
import { MasterValue, CreateMasterValueRequest, UpdateMasterValueRequest } from '../api/types'

// Master Value Types (based on the dropdown in the image)
export const MASTER_VALUE_TYPES = [
  { id: 1, name: "Contact Type" },
  { id: 2, name: "Activity Category" },
  { id: 3, name: "Relationship" },
  { id: 4, name: "Observation Category" },
]

// Custom hook
export function useMasterValues(type?: number | null) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['master-values', type],
    queryFn: () => apiClient.getMasterValues(type || null),
    staleTime: 10 * 60 * 1000, // 10 minutes - master values don't change often
    retry: 1
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateMasterValueRequest) => apiClient.createMasterValue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-values'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateMasterValueRequest) => apiClient.updateMasterValue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-values'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteMasterValue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-values'] })
    },
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createMasterValue: createMutation,
    updateMasterValue: updateMutation,
    deleteMasterValue: deleteMutation,
  }
}

// Hook for getting a single master value
export function useMasterValue(id: number) {
  return useQuery({
    queryKey: ["master-value", id],
    queryFn: () => apiClient.getMasterValue(id),
    enabled: !!id,
  })
}