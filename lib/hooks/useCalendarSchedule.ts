import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'
import {
  CalendarScheduleCreateViewModel,
  CalendarScheduleUpdateViewModel,
  CalendarSchedule,
  ApiResponse,
  DailySchedulesFilterParams,
  MonthlySchedulesFilterParams
} from '../api/types'

// =============================================================================
// QUERY KEY FACTORY
// =============================================================================

export const calendarScheduleQueryKeys = {
  all: ['calendarSchedule'] as const,
  lists: () => [...calendarScheduleQueryKeys.all, 'list'] as const,
  dailySchedules: (params: DailySchedulesFilterParams) => [...calendarScheduleQueryKeys.lists(), 'daily', params] as const,
  monthlySchedules: (params: MonthlySchedulesFilterParams) => [...calendarScheduleQueryKeys.lists(), 'monthly', params] as const,
  details: () => [...calendarScheduleQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...calendarScheduleQueryKeys.details(), id] as const,
}

// =============================================================================
// CALENDAR SCHEDULE MUTATIONS
// =============================================================================

/**
 * Create schedule mutation hook
 * Creates a new calendar schedule with cache invalidation
 */
export const useCreateSchedule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (scheduleData: CalendarScheduleCreateViewModel): Promise<CalendarSchedule> => {
      const response = await apiClient.post<ApiResponse<CalendarSchedule>>('/journal/create-event', scheduleData)
      return response.data.data
    },
    onSuccess: () => {
      // Invalidate all calendar-related queries as per requirement 5.1
      queryClient.invalidateQueries({ queryKey: calendarScheduleQueryKeys.all })
    }
  })
}

/**
 * Update schedule mutation hook
 * Updates an existing calendar schedule with cache invalidation
 */
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (scheduleData: CalendarScheduleUpdateViewModel): Promise<CalendarSchedule> => {
      const response = await apiClient.post<ApiResponse<CalendarSchedule>>('/journal/edit-event', scheduleData)
      return response.data.data
    },
    onSuccess: (data) => {
      // Invalidate both list and detail queries for that schedule as per requirement 5.2
      queryClient.invalidateQueries({ queryKey: calendarScheduleQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: calendarScheduleQueryKeys.detail(data.id) })
    }
  })
}

/**
 * Delete schedule mutation hook
 * Deletes a calendar schedule with cache invalidation
 */
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (scheduleId: string): Promise<void> => {
      await apiClient.post('/journal/delete-event', { id: scheduleId })
    },
    onSuccess: () => {
      // Invalidate all calendar queries to reflect the removal as per requirement 5.3
      queryClient.invalidateQueries({ queryKey: calendarScheduleQueryKeys.all })
    }
  })
}

// =============================================================================
// CALENDAR SCHEDULE QUERIES
// =============================================================================

/**
 * Schedule detail query hook
 * Fetches a specific schedule by ID
 */
export const useScheduleDetail = (id: string) => {
  return useQuery({
    queryKey: calendarScheduleQueryKeys.detail(id),
    queryFn: async (): Promise<CalendarSchedule> => {
      const response = await apiClient.get<ApiResponse<CalendarSchedule>>(`/journal/get-event?id=${id}`)
      return response.data.data
    },
    enabled: !!id, // Only run query if ID exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

/**
 * Daily schedules query hook
 * Fetches schedules for a specific date with filter parameters
 */
export const useDailySchedules = (params: DailySchedulesFilterParams) => {
  return useQuery({
    queryKey: calendarScheduleQueryKeys.dailySchedules(params),
    queryFn: async (): Promise<CalendarSchedule[]> => {
      const response = await apiClient.post<ApiResponse<CalendarSchedule[]>>('/journal/list-event', params)
      return response.data.data
    },
    enabled: !!params.date, // Only run query if date is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

/**
 * Monthly schedules query hook
 * Fetches schedules for a specific month with filter parameters
 */
export const useMonthlySchedules = (params: MonthlySchedulesFilterParams) => {
  return useQuery({
    queryKey: calendarScheduleQueryKeys.monthlySchedules(params),
    queryFn: async (): Promise<CalendarSchedule[]> => {
      const response = await apiClient.post<ApiResponse<CalendarSchedule[]>>('/journal/list-event', params)
      return response.data.data
    },
    enabled: !!(params.year && params.month), // Only run query if year and month are provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}