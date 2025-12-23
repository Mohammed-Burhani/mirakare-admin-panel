import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from '../api/apiClient'
import { CreatePackageRequest, UpdatePackageRequest } from '../api/types'

// Package Types (based on the dropdown in the image)
export const PACKAGE_TYPES = [
  { id: "family", name: "Family" },
  { id: "organization", name: "Organization" },
  { id: "enterprise", name: "Enterprise" },
  { id: "custom", name: "Custom" },
]

// Custom hook for active packages (used in subscriber form)
export function useActivePackages() {
  return useQuery({
    queryKey: ['packages', 'active'],
    queryFn: () => apiClient.getActivePackages(),
    staleTime: 10 * 60 * 1000, // 10 minutes - packages don't change often
    retry: 1
  })
}

// Custom hook for all packages (used in packages management)
export function usePackages(type?: string | null) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['packages', type],
    queryFn: () => apiClient.getPackages(type ? type.toLowerCase() : null), // Send lowercase to API
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })

  const createMutation = useMutation({
    mutationFn: (packageData: CreatePackageRequest) => apiClient.createPackage(packageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (packageData: UpdatePackageRequest) => apiClient.updatePackage(packageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] })
    },
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createPackage: createMutation,
    updatePackage: updateMutation,
    deletePackage: deleteMutation,
  }
}

// Hook for getting a single package
export function usePackage(id: number) {
  return useQuery({
    queryKey: ["package", id],
    queryFn: () => apiClient.getPackage(id),
    enabled: !!id,
  })
}