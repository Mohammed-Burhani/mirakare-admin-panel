import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/apiClient"
import { VitalTypeEntity, CreateVitalTypeRequest, UpdateVitalTypeRequest } from "@/lib/api/types"

// Custom hook
export function useVitalTypes() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["vital-types"],
    queryFn: () => apiClient.getVitalTypes(),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateVitalTypeRequest) => apiClient.createVitalType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vital-types"] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateVitalTypeRequest) => apiClient.updateVitalType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vital-types"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteVitalType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vital-types"] })
    },
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createVitalType: createMutation,
    updateVitalType: updateMutation,
    deleteVitalType: deleteMutation,
  }
}

// Hook for getting a single vital type
export function useVitalType(id: number) {
  return useQuery({
    queryKey: ["vital-type", id],
    queryFn: () => apiClient.getVitalType(id),
    enabled: !!id,
  })
}