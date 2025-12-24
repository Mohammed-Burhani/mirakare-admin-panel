import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'
import { VitalStatsData, VitalStatsRequest } from '../api/types'

// =============================================================================
// QUERY KEY FACTORY
// =============================================================================

export const vitalStatsQueryKeys = {
  all: ['vitalStats'] as const,
  list: (params: VitalStatsRequest) => [...vitalStatsQueryKeys.all, 'list', params] as const,
}

// =============================================================================
// VITAL STATS QUERIES
// =============================================================================

interface UseVitalStatsParams extends VitalStatsRequest {
  enabled?: boolean
}

/**
 * Vital stats query hook
 * Fetches vital statistics data based on filters
 */
export const useVitalStats = ({ 
  vitalType, 
  recipientId, 
  startDate, 
  endDate, 
  enabled = true 
}: UseVitalStatsParams) => {
  const params: VitalStatsRequest = {
    vitalType,
    recipientId,
    startDate,
    endDate,
  }

  return useQuery({
    queryKey: vitalStatsQueryKeys.list(params),
    queryFn: async (): Promise<VitalStatsData[]> => {
      return await apiClient.getVitalStats(params)
    },
    enabled: enabled && !!(startDate && endDate),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1
  })
}