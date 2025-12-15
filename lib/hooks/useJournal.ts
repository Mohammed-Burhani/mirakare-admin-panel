import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'
import {
  ApiResponse,
  JournalNote,
  CreateJournalNoteRequest,
  UpdateJournalNoteRequest,
  JournalEvent,
  CreateJournalEventRequest,
  UpdateJournalEventRequest,
  Subcategory,
  CreateSubcategoryRequest,
  UpdateSubcategoryRequest,
  JournalFilterParams,
  ToggleImportanceRequest
} from '../api/types'

// =============================================================================
// QUERY KEY FACTORY
// =============================================================================

export const journalQueryKeys = {
  all: ['journal'] as const,
  notes: () => [...journalQueryKeys.all, 'notes'] as const,
  notesList: (filters: JournalFilterParams) => [...journalQueryKeys.notes(), 'list', filters] as const,
  noteDetail: (id: string) => [...journalQueryKeys.notes(), 'detail', id] as const,
  events: () => [...journalQueryKeys.all, 'events'] as const,
  eventsList: (filters: JournalFilterParams) => [...journalQueryKeys.events(), 'list', filters] as const,
  eventDetail: (id: string) => [...journalQueryKeys.events(), 'detail', id] as const,
  subcategories: () => [...journalQueryKeys.all, 'subcategories'] as const,
  subcategoriesList: (type?: 'activity' | 'observation') => [...journalQueryKeys.subcategories(), 'list', type] as const,
  subcategoryDetail: (id: string) => [...journalQueryKeys.subcategories(), 'detail', id] as const,
}

// =============================================================================
// JOURNAL NOTE HOOKS
// =============================================================================

/**
 * List notes query hook
 * Fetches journal notes with filter parameters
 */
export const useListNotes = (filters: JournalFilterParams = {}) => {
  return useQuery({
    queryKey: journalQueryKeys.notesList(filters),
    queryFn: async (): Promise<JournalNote[]> => {
      const response = await apiClient.post<ApiResponse<JournalNote[]>>('/journal/list-note', filters)
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

/**
 * Get note detail query hook
 * Fetches a specific journal note by ID
 */
export const useNoteDetail = (id: string) => {
  return useQuery({
    queryKey: journalQueryKeys.noteDetail(id),
    queryFn: async (): Promise<JournalNote> => {
      const response = await apiClient.get<ApiResponse<JournalNote>>(`/journal/get-note?id=${id}`)
      return response.data.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

/**
 * Create note mutation hook
 * Creates a new journal note with list invalidation
 */
export const useCreateNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (noteData: CreateJournalNoteRequest): Promise<JournalNote> => {
      const response = await apiClient.post<ApiResponse<JournalNote>>('/journal/create-note', noteData)
      return response.data.data
    },
    onSuccess: () => {
      // Invalidate notes list queries to reflect new note
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.notes() })
    }
  })
}

/**
 * Update note mutation hook
 * Updates an existing journal note with cache invalidation
 */
export const useUpdateNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (noteData: UpdateJournalNoteRequest): Promise<JournalNote> => {
      const response = await apiClient.post<ApiResponse<JournalNote>>('/journal/edit-note', noteData)
      return response.data.data
    },
    onSuccess: (data) => {
      // Invalidate both list and specific note detail queries
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.notes() })
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.noteDetail(data.id) })
    }
  })
}

/**
 * Delete note mutation hook
 * Deletes a journal note with list invalidation
 */
export const useDeleteNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.post('/journal/delete-note', { id })
    },
    onSuccess: (_, id) => {
      // Invalidate notes list queries and remove specific note from cache
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.notes() })
      queryClient.removeQueries({ queryKey: journalQueryKeys.noteDetail(id) })
    }
  })
}

/**
 * Toggle note importance mutation hook
 * Toggles the importance flag of a journal note
 */
export const useToggleNoteImportance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: ToggleImportanceRequest): Promise<JournalNote> => {
      const response = await apiClient.post<ApiResponse<JournalNote>>('/journal/edit-note', {
        id: request.id,
        isImportant: request.isImportant
      })
      return response.data.data
    },
    onSuccess: (data) => {
      // Invalidate notes list queries to reflect importance change
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.notes() })
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.noteDetail(data.id) })
    }
  })
}

// =============================================================================
// JOURNAL EVENT HOOKS
// =============================================================================

/**
 * List events query hook
 * Fetches journal events with filter parameters
 */
export const useListEvents = (filters: JournalFilterParams = {}) => {
  return useQuery({
    queryKey: journalQueryKeys.eventsList(filters),
    queryFn: async (): Promise<JournalEvent[]> => {
      const response = await apiClient.post<ApiResponse<JournalEvent[]>>('/journal/list-event', filters)
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

/**
 * Get event detail query hook
 * Fetches a specific journal event by ID
 */
export const useEventDetail = (id: string) => {
  return useQuery({
    queryKey: journalQueryKeys.eventDetail(id),
    queryFn: async (): Promise<JournalEvent> => {
      const response = await apiClient.get<ApiResponse<JournalEvent>>(`/journal/get-event?id=${id}`)
      return response.data.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

/**
 * Create event mutation hook
 * Creates a new journal event with list invalidation
 */
export const useCreateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (eventData: CreateJournalEventRequest): Promise<JournalEvent> => {
      const response = await apiClient.post<ApiResponse<JournalEvent>>('/journal/create-event', eventData)
      return response.data.data
    },
    onSuccess: () => {
      // Invalidate events list queries to reflect new event
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.events() })
    }
  })
}

/**
 * Update event mutation hook
 * Updates an existing journal event with cache invalidation
 */
export const useUpdateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (eventData: UpdateJournalEventRequest): Promise<JournalEvent> => {
      const response = await apiClient.post<ApiResponse<JournalEvent>>('/journal/edit-event', eventData)
      return response.data.data
    },
    onSuccess: (data) => {
      // Invalidate both list and specific event detail queries
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.events() })
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.eventDetail(data.id) })
    }
  })
}

/**
 * Delete event mutation hook
 * Deletes a journal event with list invalidation
 */
export const useDeleteEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.post('/journal/delete-event', { id })
    },
    onSuccess: (_, id) => {
      // Invalidate events list queries and remove specific event from cache
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.events() })
      queryClient.removeQueries({ queryKey: journalQueryKeys.eventDetail(id) })
    }
  })
}

/**
 * Toggle event importance mutation hook
 * Toggles the importance flag of a journal event
 */
export const useToggleEventImportance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: ToggleImportanceRequest): Promise<JournalEvent> => {
      const response = await apiClient.post<ApiResponse<JournalEvent>>('/journal/edit-event', {
        id: request.id,
        isImportant: request.isImportant
      })
      return response.data.data
    },
    onSuccess: (data) => {
      // Invalidate events list queries to reflect importance change
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.events() })
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.eventDetail(data.id) })
    }
  })
}

// =============================================================================
// SUBCATEGORY HOOKS
// =============================================================================

/**
 * List activity subcategories query hook
 * Fetches activity subcategories
 */
export const useActivitySubcategories = () => {
  return useQuery({
    queryKey: journalQueryKeys.subcategoriesList('activity'),
    queryFn: async (): Promise<Subcategory[]> => {
      const response = await apiClient.post<ApiResponse<Subcategory[]>>('/journal/subcategory/list-note', { type: 'activity' })
      return response.data.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (subcategories change less frequently)
    retry: 1
  })
}

/**
 * List observation subcategories query hook
 * Fetches observation subcategories
 */
export const useObservationSubcategories = () => {
  return useQuery({
    queryKey: journalQueryKeys.subcategoriesList('observation'),
    queryFn: async (): Promise<Subcategory[]> => {
      const response = await apiClient.post<ApiResponse<Subcategory[]>>('/journal/subcategory/list-note', { type: 'observation' })
      return response.data.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (subcategories change less frequently)
    retry: 1
  })
}

/**
 * List all subcategories query hook
 * Fetches all subcategories regardless of type
 */
export const useAllSubcategories = () => {
  return useQuery({
    queryKey: journalQueryKeys.subcategoriesList(),
    queryFn: async (): Promise<Subcategory[]> => {
      const response = await apiClient.post<ApiResponse<Subcategory[]>>('/journal/subcategory/list-note', {})
      return response.data.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1
  })
}

/**
 * Get subcategory detail query hook
 * Fetches a specific subcategory by ID
 */
export const useSubcategoryDetail = (id: string) => {
  return useQuery({
    queryKey: journalQueryKeys.subcategoryDetail(id),
    queryFn: async (): Promise<Subcategory> => {
      const response = await apiClient.get<ApiResponse<Subcategory>>(`/journal/subcategory/get-note?id=${id}`)
      return response.data.data
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1
  })
}

/**
 * Create subcategory mutation hook
 * Creates a new subcategory with targeted invalidation
 */
export const useCreateSubcategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (subcategoryData: CreateSubcategoryRequest): Promise<Subcategory> => {
      const response = await apiClient.post<ApiResponse<Subcategory>>('/journal/subcategory/create-note', subcategoryData)
      return response.data.data
    },
    onSuccess: (data) => {
      // Invalidate subcategory queries with targeted invalidation
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.subcategories() })
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.subcategoriesList(data.type) })
    }
  })
}

/**
 * Update subcategory mutation hook
 * Updates an existing subcategory with targeted invalidation
 */
export const useUpdateSubcategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (subcategoryData: UpdateSubcategoryRequest): Promise<Subcategory> => {
      const response = await apiClient.post<ApiResponse<Subcategory>>('/journal/subcategory/edit-note', subcategoryData)
      return response.data.data
    },
    onSuccess: (data) => {
      // Invalidate subcategory queries and specific detail
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.subcategories() })
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.subcategoriesList(data.type) })
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.subcategoryDetail(data.id) })
    }
  })
}

/**
 * Delete subcategory mutation hook
 * Deletes a subcategory with targeted invalidation
 */
export const useDeleteSubcategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.post('/journal/subcategory/delete-note', { id })
    },
    onSuccess: (_, id) => {
      // Invalidate all subcategory queries and remove specific subcategory from cache
      queryClient.invalidateQueries({ queryKey: journalQueryKeys.subcategories() })
      queryClient.removeQueries({ queryKey: journalQueryKeys.subcategoryDetail(id) })
    }
  })
}