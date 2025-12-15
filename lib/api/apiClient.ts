import httpClient from './httpClient'
import { CalendarSchedule, JournalNote, GraphData, Contact } from './types'

// API response wrapper type
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// Export httpClient methods directly
export const apiClient = Object.assign(httpClient, {
  // Dashboard
  getDashboard: async () => {
    const response = await httpClient.get<unknown>('/dashboard/vital-count')
    return response.data || {}
  },

  // Contacts
  getContacts: async () => {
    const response = await httpClient.post<Contact[]>('/contact/list', {})
    return response.data || []
  },

  createContact: async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await httpClient.post<Contact>('/contact/create', contact)
    return response.data
  },

  updateContact: async (id: number, contact: Partial<Contact>) => {
    const response = await httpClient.post<Contact>('/contact/edit', { ...contact, id })
    return response.data
  },

  deleteContact: async (id: number) => {
    await httpClient.post('/contact/delete', { id })
  },

  // Kare Givers
  getKareGivers: async () => {
    const response = await httpClient.post<unknown[]>('/user/kare-admin/kare-giver/list', {})
    return response.data || []
  },

  createKareGiver: async (giver: unknown) => {
    const response = await httpClient.post<unknown>('/user/kare-admin/kare-giver/add', giver)
    return response.data
  },

  updateKareGiver: async (id: number, giver: unknown) => {
    const response = await httpClient.post<unknown>('/user/kare-admin/kare-giver/edit', { ...giver, id })
    return response.data
  },

  deleteKareGiver: async (id: number) => {
    await httpClient.post('/user/kare-admin/kare-giver/delete', { id })
  },

  // Kare Recipients
  getKareRecipients: async () => {
    const response = await httpClient.post<unknown[]>('/kare-recipient/list', {})
    return response.data || []
  },

  createKareRecipient: async (recipient: unknown) => {
    const response = await httpClient.post<unknown>('/kare-recipient/create', recipient)
    return response.data
  },

  updateKareRecipient: async (id: number, recipient: unknown) => {
    const response = await httpClient.post<unknown>('/kare-recipient/edit', { ...recipient, id })
    return response.data
  },

  deleteKareRecipient: async (id: number) => {
    await httpClient.post('/kare-recipient/delete', { id })
  },

  // Kare Viewers
  getKareViewers: async () => {
    const response = await httpClient.post<unknown[]>('/user/kare-admin/viewer/list', {})
    return response.data || []
  },

  createKareViewer: async (viewer: unknown) => {
    const response = await httpClient.post<unknown>('/user/kare-admin/viewer/add', viewer)
    return response.data
  },

  updateKareViewer: async (id: number, viewer: unknown) => {
    const response = await httpClient.post<unknown>('/user/kare-admin/viewer/edit', { ...viewer, id })
    return response.data
  },

  deleteKareViewer: async (id: number) => {
    await httpClient.post('/user/kare-admin/viewer/delete', { id })
  },

  // Kare Admins
  getKareAdmins: async () => {
    const response = await httpClient.post<unknown[]>('/user/org/kare-admin/list', {})
    return response.data || []
  },

  createKareAdmin: async (admin: unknown) => {
    const response = await httpClient.post<unknown>('/user/org/kare-admin/add', admin)
    return response.data
  },

  updateKareAdmin: async (id: number, admin: unknown) => {
    const response = await httpClient.post<unknown>('/user/org/kare-admin/edit', { ...admin, id })
    return response.data
  },

  deleteKareAdmin: async (id: number) => {
    await httpClient.post('/user/org/kare-admin/delete', { id })
  },

  // Calendar
  getCalendarEvents: async () => {
    const response = await httpClient.post<CalendarSchedule[]>('/journal/list-event', {})
    return response.data || []
  },

  createCalendarEvent: async (event: Omit<CalendarSchedule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await httpClient.post<CalendarSchedule>('/journal/create-event', event)
    return response.data
  },

  updateCalendarEvent: async (id: number, event: Partial<CalendarSchedule>) => {
    const response = await httpClient.post<CalendarSchedule>('/journal/edit-event', { ...event, id })
    return response.data
  },

  deleteCalendarEvent: async (id: number) => {
    await httpClient.post('/journal/delete-event', { id })
  },

  // Journal
  getJournalEntries: async () => {
    const response = await httpClient.post<JournalNote[]>('/journal/list-note', {})
    return response.data || []
  },

  createJournalEntry: async (entry: Omit<JournalNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await httpClient.post<JournalNote>('/journal/create-note', entry)
    return response.data
  },

  updateJournalEntry: async (id: number, entry: Partial<JournalNote>) => {
    const response = await httpClient.post<JournalNote>('/journal/edit-note', { ...entry, id })
    return response.data
  },

  deleteJournalEntry: async (id: number) => {
    await httpClient.post('/journal/delete-note', { id })
  },

  // Graph
  getGraphData: async (params?: { vitalType?: string; startDate?: string; endDate?: string }) => {
    const response = await httpClient.post<GraphData>('/vital/provider/tryvital/list', params || {})
    return response.data
  },

  // Auth
  login: async (username: string, password: string) => {
    const response = await httpClient.post<{ AccessToken: string; RefreshToken: string; Name: string; Role: string }>('/login', {
      username,
      password,
    })
    // Store token
    if (response.data.AccessToken) {
      localStorage.setItem('authToken', response.data.AccessToken)
      localStorage.setItem('refreshToken', response.data.RefreshToken)
    }
    return response.data
  },

  logout: async () => {
    await httpClient.post('/revoke-token', {})
    localStorage.removeItem('authToken')
    return { success: true }
  },
})
