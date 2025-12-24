import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'
import { AdminUser, AdminRole } from '../api/types'

// =============================================================================
// QUERY KEY FACTORY
// =============================================================================

export const administrationQueryKeys = {
  all: ['administration'] as const,
  users: () => [...administrationQueryKeys.all, 'users'] as const,
  roles: () => [...administrationQueryKeys.all, 'roles'] as const,
}

// =============================================================================
// ADMINISTRATION QUERIES
// =============================================================================

/**
 * Admin users query hook
 * Fetches list of admin users using subscriber list API
 */
export const useAdminUsers = () => {
  return useQuery({
    queryKey: administrationQueryKeys.users(),
    queryFn: async (): Promise<AdminUser[]> => {
      return await apiClient.getAdminUsers()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

/**
 * Admin roles query hook
 * Fetches list of admin roles using subscriber list API
 */
export const useAdminRoles = () => {
  return useQuery({
    queryKey: administrationQueryKeys.roles(),
    queryFn: async (): Promise<AdminRole[]> => {
      return await apiClient.getAdminRoles()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}