import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'
import { SubscriptionConsumptionData } from '../api/types'

// =============================================================================
// QUERY KEY FACTORY
// =============================================================================

export const subscriptionConsumptionQueryKeys = {
  all: ['subscriptionConsumption'] as const,
  list: () => [...subscriptionConsumptionQueryKeys.all, 'list'] as const,
}

// =============================================================================
// SUBSCRIPTION CONSUMPTION QUERIES
// =============================================================================

/**
 * Subscription consumption query hook
 * Fetches subscription consumption data
 */
export const useSubscriptionConsumption = () => {
  return useQuery({
    queryKey: subscriptionConsumptionQueryKeys.list(),
    queryFn: async (): Promise<SubscriptionConsumptionData[]> => {
      return await apiClient.getSubscriptionConsumption()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}