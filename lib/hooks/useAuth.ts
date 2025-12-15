import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'
import {
  AuthenticateRequest,
  GoogleAuthRequest,
  AuthResponse,
  ApiResponse,
  UserDetails,
  UserProfileUpdateViewModel,
  ProfileImageUpdateRequest,
  ResetPasswordRequest,
  TokenRevocationRequest
} from '../api/types'

// =============================================================================
// QUERY KEY FACTORY
// =============================================================================

export const authQueryKeys = {
  all: ['auth'] as const,
  userDetails: () => [...authQueryKeys.all, 'userDetails'] as const,
  tokenValidation: (token: string) => [...authQueryKeys.all, 'tokenValidation', token] as const,
}

// =============================================================================
// AUTHENTICATION MUTATIONS
// =============================================================================

/**
 * Login mutation hook
 * Handles user authentication and token storage
 */
export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: AuthenticateRequest): Promise<AuthResponse> => {
      const response = await apiClient.post<AuthResponse>('/login', credentials)
      return response.data
    },
    onSuccess: (data) => {
      // Store authentication token in localStorage
      localStorage.setItem('authToken', data.AccessToken)
      
      // Store refresh token
      localStorage.setItem('refreshToken', data.RefreshToken)
      
      // Store user info
      localStorage.setItem('userName', data.Name)
      localStorage.setItem('userRole', data.Role)
      
      // Invalidate all auth-related queries to trigger refetch with new token
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all })
    },
    onError: () => {
      // Clear any existing tokens on login failure
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
    }
  })
}

/**
 * Google login mutation hook
 * Handles Google OAuth authentication
 */
export const useGoogleLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (googleAuth: GoogleAuthRequest): Promise<AuthResponse> => {
      const response = await apiClient.post<AuthResponse>('/auth/google/login', googleAuth)
      return response.data
    },
    onSuccess: (data) => {
      // Store authentication token in localStorage
      localStorage.setItem('authToken', data.AccessToken)
      
      // Store refresh token
      localStorage.setItem('refreshToken', data.RefreshToken)
      
      // Store user info
      localStorage.setItem('userName', data.Name)
      localStorage.setItem('userRole', data.Role)
      
      // Invalidate all auth-related queries
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all })
    },
    onError: () => {
      // Clear any existing tokens on login failure
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
    }
  })
}

/**
 * Logout mutation hook
 * Handles user logout and cache clearing
 */
export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<void> => {
      const token = localStorage.getItem('authToken')
      if (token) {
        // Call logout endpoint to invalidate token on server
        await apiClient.post('/revoke-token', { token })
      }
    },
    onSuccess: () => {
      // Clear authentication tokens from localStorage
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      
      // Clear all cached data
      queryClient.clear()
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    },
    onError: () => {
      // Even if logout fails on server, clear local data
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      queryClient.clear()
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  })
}

/**
 * Token revocation mutation hook
 * Revokes authentication token on server
 */
export const useRevokeToken = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: TokenRevocationRequest): Promise<void> => {
      await apiClient.post('/revoke-token', request)
    },
    onSuccess: () => {
      // Clear authentication tokens and cache
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      queryClient.clear()
    }
  })
}

// =============================================================================
// PROFILE MANAGEMENT MUTATIONS
// =============================================================================

/**
 * Update user profile mutation hook
 * Updates user profile information with cache invalidation
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (profileData: UserProfileUpdateViewModel): Promise<UserDetails> => {
      const response = await apiClient.post<ApiResponse<UserDetails>>('/user/profile/edit', profileData)
      return response.data.data
    },
    onSuccess: () => {
      // Invalidate user details queries to reflect changes
      queryClient.invalidateQueries({ queryKey: authQueryKeys.userDetails() })
    }
  })
}

/**
 * Update profile image mutation hook
 * Updates user profile image
 */
export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (imageData: ProfileImageUpdateRequest): Promise<UserDetails> => {
      const formData = new FormData()
      formData.append('image', imageData.imageFile)
      
      const response = await apiClient.post<ApiResponse<UserDetails>>('/user/ProfileImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data.data
    },
    onSuccess: () => {
      // Invalidate user details queries to reflect image changes
      queryClient.invalidateQueries({ queryKey: authQueryKeys.userDetails() })
    }
  })
}

/**
 * Reset password mutation hook
 * Handles password reset functionality
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (resetData: ResetPasswordRequest): Promise<void> => {
      await apiClient.post('/reset-password', resetData)
    }
  })
}

// =============================================================================
// AUTHENTICATION QUERIES
// =============================================================================

/**
 * User details query hook
 * Fetches current user details with token dependency
 */
export const useUserDetails = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null

  return useQuery({
    queryKey: authQueryKeys.userDetails(),
    queryFn: async (): Promise<UserDetails> => {
      const response = await apiClient.post<ApiResponse<UserDetails>>('/user-details', {})
      return response.data.data
    },
    enabled: !!token, // Only run query if token exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

/**
 * Token validation query hook
 * Validates authentication token with 1-minute staleTime
 */
export const useValidateToken = (token?: string) => {
  const currentToken = token || (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null)

  return useQuery({
    queryKey: authQueryKeys.tokenValidation(currentToken || ''),
    queryFn: async (): Promise<boolean> => {
      if (!currentToken) return false
      
      try {
        const response = await apiClient.post<ApiResponse<{ valid: boolean }>>('/refresh-token', {
          token: currentToken
        })
        return response.data.data.valid
      } catch {
        return false
      }
    },
    enabled: !!currentToken, // Only run if token exists
    staleTime: 1 * 60 * 1000, // 1 minute as per requirements
    retry: 1
  })
}