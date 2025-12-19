import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/apiClient'
import { FamilyProfile, UpdateFamilyProfileRequest } from '@/lib/api/types'

// API functions
const familyProfileApi = {
  getProfile: (): Promise<FamilyProfile> => {
    return apiClient.getFamilyProfile()
  },

  updateProfile: (data: UpdateFamilyProfileRequest): Promise<FamilyProfile> => {
    return apiClient.updateFamilyProfile(data)
  }
}

// Custom hooks
export const useFamilyProfile = () => {
  return useQuery({
    queryKey: ['familyProfile'],
    queryFn: familyProfileApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUpdateFamilyProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: familyProfileApi.updateProfile,
    onSuccess: (data) => {
      // Update the cache with the new data
      queryClient.setQueryData(['familyProfile'], data)
      // Optionally invalidate to refetch
      queryClient.invalidateQueries({ queryKey: ['familyProfile'] })
    },
    onError: (error) => {
      console.error('Failed to update family profile:', error)
    }
  })
}