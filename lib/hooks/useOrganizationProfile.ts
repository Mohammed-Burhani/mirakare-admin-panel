import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'
import { OrganizationProfile, OrganizationProfileUpdateRequest } from '../api/types'

// =============================================================================
// QUERY KEY FACTORY
// =============================================================================

export const organizationProfileQueryKeys = {
  all: ['organizationProfile'] as const,
  profile: () => [...organizationProfileQueryKeys.all, 'profile'] as const,
}

// =============================================================================
// ORGANIZATION PROFILE QUERIES
// =============================================================================

/**
 * Organization profile query hook
 * Fetches the current organization profile
 */
export const useOrganizationProfile = () => {
  return useQuery({
    queryKey: organizationProfileQueryKeys.profile(),
    queryFn: async (): Promise<OrganizationProfile> => {
      return await apiClient.getOrganizationProfile()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

// =============================================================================
// ORGANIZATION PROFILE MUTATIONS
// =============================================================================

/**
 * Update organization profile mutation hook
 * Updates organization profile with cache invalidation
 */
export const useUpdateOrganizationProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (profile: OrganizationProfileUpdateRequest): Promise<OrganizationProfile> => {
      return await apiClient.updateOrganizationProfile(profile)
    },
    onSuccess: () => {
      // Invalidate organization profile queries to reflect changes
      queryClient.invalidateQueries({ queryKey: organizationProfileQueryKeys.all })
    }
  })
}