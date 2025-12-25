import httpClient from './httpClient'
import { 
  CalendarSchedule, 
  JournalNote, 
  GraphData, 
  Contact,
  KareAdmin,
  KareGiver,
  KareViewer,
  KareRecipient,
  CreateKareAdminRequest,
  CreateKareGiverRequest,
  CreateKareViewerRequest,
  CreateKareRecipientRequest,
  CreateContactRequest,
  UpdateContactRequest,
  MasterValue,
  CreateMasterValueRequest,
  UpdateMasterValueRequest,
  Subscriber,
  CreateSubscriberRequest,
  UpdateSubscriberRequest,
  Package,
  CreatePackageRequest,
  UpdatePackageRequest,
  VitalTypeEntity,
  CreateVitalTypeRequest,
  UpdateVitalTypeRequest,
  OrganizationProfile,
  OrganizationProfileUpdateRequest,
  AdminUser,
  AdminRole,
  VitalStatsData,
  VitalStatsRequest,
  SubscriptionConsumptionData
} from './types'

// Export httpClient methods directly
export const apiClient = Object.assign(httpClient, {
  // Dashboard
  getDashboard: async () => {
    const response = await httpClient.get<unknown>('/dashboard/vital-count')
    return response.data || {}
  },

  // Contacts
  getContacts: async (params?: { subId?: number | null; userId?: number | null; recipientId?: number | null }) => {
    const response = await httpClient.post<Contact[]>('/contact/ka/list', {
      subId: params?.subId ?? null,
      userId: params?.userId ?? null,
      recipientId: params?.recipientId ?? null
    })
    return response.data || []
  },

  getContact: async (id: number) => {
    const response = await httpClient.post<Contact>('/contact/ka/get', id.toString())
    return response.data
  },

  createContact: async (contact: CreateContactRequest) => {
    const response = await httpClient.post<Contact>('/contact/ka/add', contact)
    return response.data
  },

  updateContact: async (contact: UpdateContactRequest) => {
    const response = await httpClient.post<Contact>('/contact/ka/edit', contact)
    return response.data
  },

  deleteContact: async (id: number) => {
    await httpClient.post('/contact/ka/delete', id)
  },

  // Kare Givers
  getKareGivers: async (): Promise<KareGiver[]> => {
    const response = await httpClient.post<KareGiver[]>('/user/kare-admin/kare-giver/list', {})
    return response.data || []
  },

  getKareGiver: async (id: number): Promise<KareGiver> => {
    const response = await httpClient.post<KareGiver>('/user/kare-admin/kare-giver/get', { id, rid: null })
    return response.data
  },

  createKareGiver: async (giver: CreateKareGiverRequest): Promise<KareGiver> => {
    const response = await httpClient.post<KareGiver>('/user/kare-admin/kare-giver/add', giver)
    return response.data
  },

  updateKareGiver: async (id: number, giver: Partial<CreateKareGiverRequest>): Promise<KareGiver> => {
    const response = await httpClient.post<KareGiver>('/user/kare-admin/kare-giver/edit', { ...giver, id })
    return response.data
  },

  deleteKareGiver: async (id: number): Promise<void> => {
    await httpClient.post('/user/kare-admin/kare-giver/delete', id )
  },

  // Kare Recipients
  getKareRecipients: async (): Promise<KareRecipient[]> => {
    const response = await httpClient.post<KareRecipient[]>('/kare-recipient/list', {})
    return response.data || []
  },

  // Kare Recipients for dropdown (new API)
  getKareRecipientsForDropdown: async (): Promise<KareRecipient[]> => {
    const response = await httpClient.post<KareRecipient[]>('/kare-recipient/ka/list', {})
    return response.data || []
  },

  getKareRecipient: async (id: number): Promise<KareRecipient> => {
    const response = await httpClient.get<KareRecipient>(`/kare-recipient/get?id=${id}`)
    return response.data
  },

  createKareRecipient: async (recipient: CreateKareRecipientRequest): Promise<KareRecipient> => {
    const response = await httpClient.post<KareRecipient>('/kare-recipient/create', recipient)
    return response.data
  },

  updateKareRecipient: async (id: number, recipient: Partial<CreateKareRecipientRequest>): Promise<KareRecipient> => {
    const response = await httpClient.post<KareRecipient>('/kare-recipient/edit', { ...recipient, id })
    return response.data
  },

  deleteKareRecipient: async (id: number): Promise<void> => {
    await httpClient.post('/kare-recipient/delete', id )
  },

  // Kare Viewers
  getKareViewers: async (): Promise<KareViewer[]> => {
    const response = await httpClient.post<KareViewer[]>('/user/kare-admin/viewer/list', {})
    return response.data || []
  },

  getKareViewer: async (id: number): Promise<KareViewer> => {
    const response = await httpClient.post<KareViewer>('/user/kare-admin/viewer/get', { id, rid: null })
    return response.data
  },

  createKareViewer: async (viewer: CreateKareViewerRequest): Promise<KareViewer> => {
    const response = await httpClient.post<KareViewer>('/user/kare-admin/viewer/add', viewer)
    return response.data
  },

  updateKareViewer: async (id: number, viewer: Partial<CreateKareViewerRequest>): Promise<KareViewer> => {
    const response = await httpClient.post<KareViewer>('/user/kare-admin/viewer/edit', { ...viewer, id })
    return response.data
  },

  deleteKareViewer: async (id: number): Promise<void> => {
    await httpClient.post('/user/kare-admin/viewer/delete', id)
  },

  // Kare Admins
  getKareAdmins: async (): Promise<KareAdmin[]> => {
    const response = await httpClient.post<KareAdmin[]>('/user/org/kare-admin/list', {})
    return response.data || []
  },

  getKareAdmin: async (id: number): Promise<KareAdmin> => {
    const response = await httpClient.post<KareAdmin>('/user/org/kare-admin/get', { id, rid: null })
    return response.data
  },

  createKareAdmin: async (admin: CreateKareAdminRequest): Promise<KareAdmin> => {
    const response = await httpClient.post<KareAdmin>('/user/org/kare-admin/add', admin)
    return response.data
  },

  updateKareAdmin: async (id: number, admin: Partial<CreateKareAdminRequest>): Promise<KareAdmin> => {
    const response = await httpClient.post<KareAdmin>('/user/org/kare-admin/edit', { ...admin, id })
    return response.data
  },

  deleteKareAdmin: async (id: number): Promise<void> => {
    await httpClient.post('/user/org/kare-admin/delete', id)
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
    await httpClient.post('/journal/delete-event', id)
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
    await httpClient.post('/journal/delete-note', id)
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

  // Master Values
  getMasterValues: async (type: number | null = null): Promise<MasterValue[]> => {
    const response = await httpClient.post<MasterValue[]>('/mastervalue/list', { type })
    return response.data || []
  },

  getMasterValue: async (id: number): Promise<MasterValue> => {
    const response = await httpClient.post<MasterValue>('/mastervalue/get', { id })
    return response.data
  },

  createMasterValue: async (masterValue: CreateMasterValueRequest): Promise<MasterValue> => {
    const response = await httpClient.post<MasterValue>('/mastervalue/add', masterValue)
    return response.data
  },

  updateMasterValue: async (masterValue: UpdateMasterValueRequest): Promise<MasterValue> => {
    const response = await httpClient.post<MasterValue>('/mastervalue/edit', masterValue)
    return response.data
  },

  deleteMasterValue: async (id: number): Promise<void> => {
    await httpClient.post('/mastervalue/delete', { id })
  },

  // Family Profile
  getFamilyProfile: async () => {
    const response = await httpClient.get('/subscriber/profile')
    return response.data
  },

  updateFamilyProfile: async (data: {
    fname: string
    mname?: string
    lname: string
    email: string
    mobile: string
    address1?: string
    address2?: string
    city?: string
    state?: string
    zipcode?: string
    country?: string
    notes?: string
  }) => {
    const response = await httpClient.post('/subscriber/profile/update', data)
    return response.data
  },

  // Vital Types
  getVitalTypes: async (): Promise<VitalTypeEntity[]> => {
    const response = await httpClient.post<VitalTypeEntity[]>('/vital-type/list', {})
    return response.data || []
  },

  getVitalType: async (id: number): Promise<VitalTypeEntity> => {
    const response = await httpClient.get<VitalTypeEntity>(`/vital-type/get?id=${id}`)
    return response.data
  },

  createVitalType: async (vitalType: CreateVitalTypeRequest): Promise<VitalTypeEntity> => {
    const response = await httpClient.post<VitalTypeEntity>('/vital-type/add', vitalType)
    return response.data
  },

  updateVitalType: async (vitalType: UpdateVitalTypeRequest): Promise<VitalTypeEntity> => {
    const response = await httpClient.post<VitalTypeEntity>('/vital-type/edit', vitalType)
    return response.data
  },

  deleteVitalType: async (id: number): Promise<void> => {
    await httpClient.post('/vital-type/delete', id)
  },

  // Subscribers
  getSubscribers: async (type?: string | null): Promise<Subscriber[]> => {
    const response = await httpClient.post<Subscriber[]>('/subscriber/list', { type: type || null })
    return response.data || []
  },

  getSubscriber: async (id: number): Promise<Subscriber> => {
    const response = await httpClient.get<Subscriber>(`/subscriber/get?id=${id}`)
    return response.data
  },

  createSubscriber: async (subscriber: CreateSubscriberRequest): Promise<Subscriber> => {
    const response = await httpClient.post<Subscriber>('/subscriber/register', subscriber)
    return response.data
  },

  updateSubscriber: async (subscriber: UpdateSubscriberRequest): Promise<Subscriber> => {
    const response = await httpClient.post<Subscriber>('/subscriber/edit', subscriber)
    return response.data
  },

  deleteSubscriber: async (id: number): Promise<void> => {
    await httpClient.post('/subscriber/delete', { id })
  },

  // Packages
  getPackages: async (type?: string | null): Promise<Package[]> => {
    const response = await httpClient.post<Package[]>('/package/list', { type: type || null })
    return response.data || []
  },

  getPackage: async (id: number): Promise<Package> => {
    const response = await httpClient.get<Package>(`/package/get?id=${id}`)
    return response.data
  },

  createPackage: async (packageData: CreatePackageRequest): Promise<Package> => {
    const response = await httpClient.post<Package>('/package/create', packageData)
    return response.data
  },

  updatePackage: async (packageData: UpdatePackageRequest): Promise<Package> => {
    const response = await httpClient.post<Package>('/package/edit', packageData)
    return response.data
  },

  deletePackage: async (id: number): Promise<void> => {
    await httpClient.post('/package/delete', { id })
  },

  getActivePackages: async (): Promise<Package[]> => {
    const response = await httpClient.post<Package[]>('/package/active/list', {})
    return response.data || []
  },

  // Organization Profile
  getOrganizationProfile: async (): Promise<OrganizationProfile> => {
    const response = await httpClient.get<OrganizationProfile>('/subscriber/profile')
    return response.data
  },

  updateOrganizationProfile: async (profile: OrganizationProfileUpdateRequest): Promise<OrganizationProfile> => {
    const response = await httpClient.post<OrganizationProfile>('/subscriber/profile/update', profile)
    return response.data
  },

  // Administration
  getAdminUsers: async (): Promise<AdminUser[]> => {
    const response = await httpClient.post<AdminUser[]>('/subscriber/list', { type: null })
    return response.data
  },

  getAdminRoles: async (): Promise<AdminRole[]> => {
    const response = await httpClient.post<AdminRole[]>('/subscriber/list', { type: null })
    return response.data
  },

  // Vital Stats
  getVitalStats: async (params: VitalStatsRequest): Promise<VitalStatsData[]> => {
    const response = await httpClient.post<VitalStatsData[]>('/vital/provider/tryvital/list', params)
    
    // Transform the response data to include computed fields for display
    const transformedData = (response.data || []).map(item => ({
      ...item,
      date: item.timestamp.split('T')[0], // Extract date from timestamp
      time: item.timestamp.split('T')[1]?.split('.')[0] || '', // Extract time from timestamp
      value: item.systolic && item.diastolic ? `${item.systolic}/${item.diastolic}` : item.systolic || item.diastolic || 'N/A'
    }))
    
    return transformedData
  },

  // Subscription Consumption
  getSubscriptionConsumption: async (): Promise<SubscriptionConsumptionData[]> => {
    const response = await httpClient.post<SubscriptionConsumptionData[]>('/report/subscription-consumed', {})
    
    // Add id field for DataTable compatibility
    const transformedData = (response.data || []).map((item, index) => ({
      ...item,
      id: `${item.name}-${index}` // Create unique id from name and index
    }))
    
    return transformedData
  },
})
