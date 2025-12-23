// Core TypeScript interfaces for React Query integration
// This file contains all type definitions for API requests and responses

// =============================================================================
// CORE BASE INTERFACES
// =============================================================================

/**
 * Generic API Response Wrapper
 * Used to wrap all API responses with consistent structure
 */
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}

// =============================================================================
// AUTHENTICATION TYPES
// =============================================================================

/**
 * Authentication request payload
 */
export interface AuthenticateRequest {
  username: string
  password: string
}

/**
 * Google authentication request payload
 */
export interface GoogleAuthRequest {
  token: string
}

/**
 * Authentication response data
 */
export interface AuthResponse {
  Name: string
  UserName: string
  ProfileImage: string | null
  Role: string
  AccessToken: string
  RefreshToken: string
  ForcePwdChange: boolean
  SubscriptionType: string
}

/**
 * Token validation request
 */
export interface TokenValidationRequest {
  token: string
}

/**
 * Token revocation request
 */
export interface TokenRevocationRequest {
  token: string
}

/**
 * User details interface
 */
export interface UserDetails {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  profileImageUrl?: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// =============================================================================
// USER PROFILE AND CALENDAR TYPES
// =============================================================================

/**
 * User profile update payload
 */
export interface UserProfileUpdateViewModel {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
}

/**
 * Profile image update payload
 */
export interface ProfileImageUpdateRequest {
  imageFile: File
}

/**
 * Password reset request
 */
export interface ResetPasswordRequest {
  email: string
  newPassword: string
  confirmPassword: string
  resetToken: string
}

/**
 * Calendar schedule creation payload
 */
export interface CalendarScheduleCreateViewModel {
  title: string
  description?: string
  startDate: string
  endDate: string
  isAllDay: boolean
  userId?: string
  categoryId?: string
  priority?: 'low' | 'medium' | 'high'
}

/**
 * Calendar schedule update payload
 */
export interface CalendarScheduleUpdateViewModel extends CalendarScheduleCreateViewModel {
  id: string
}

/**
 * Calendar schedule response
 */
export interface CalendarSchedule {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  isAllDay: boolean
  userId: string
  categoryId?: string
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

/**
 * Filter parameters for daily schedules
 */
export interface DailySchedulesFilterParams {
  date: string
  userId?: string
}

/**
 * Filter parameters for monthly schedules
 */
export interface MonthlySchedulesFilterParams {
  year: number
  month: number
  userId?: string
}

// =============================================================================
// DASHBOARD AND VITAL SIGNS TYPES
// =============================================================================

/**
 * Vital signs filter parameters
 */
export interface VitalFilterParams {
  startDate?: string
  endDate?: string
  userId?: string
  limit?: number
  offset?: number
}

/**
 * Vital signs data point
 */
export interface VitalSignsData {
  id: string
  value: number
  unit: string
  recordedAt: string
  userId: string
  vitalType: VitalType
  notes?: string
}

/**
 * Supported vital sign types
 */
export type VitalType = 
  | 'bloodPressure'
  | 'heartRate'
  | 'temperature'
  | 'weight'
  | 'bloodSugar'
  | 'oxygenSaturation'
  | 'respiratoryRate'
  | 'bmi'

/**
 * Dashboard event interface
 */
export interface DashboardEvent {
  id: string
  title: string
  description?: string
  eventDate: string
  eventType: 'appointment' | 'medication' | 'exercise' | 'meal' | 'other'
  userId: string
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Dashboard event filter parameters
 */
export interface DashboardEventFilterParams {
  startDate?: string
  endDate?: string
  eventType?: string
  userId?: string
  isCompleted?: boolean
}

/**
 * Reminder interface
 */
export interface Reminder {
  id: string
  title: string
  description?: string
  reminderDate: string
  isRead: boolean
  isMissed: boolean
  userId: string
  relatedEventId?: string
  createdAt: string
  updatedAt: string
}

/**
 * Reminder filter parameters
 */
export interface ReminderFilterParams {
  startDate?: string
  endDate?: string
  isRead?: boolean
  isMissed?: boolean
  userId?: string
}

/**
 * Reminder event creation payload
 */
export interface CreateReminderEventRequest {
  title: string
  description?: string
  reminderDate: string
  userId: string
  relatedEventId?: string
}

/**
 * Dashboard summary data
 */
export interface DashboardSummary {
  vitalSummary: VitalSummary
  journalInsights: JournalInsights
  upcomingEvents: DashboardEvent[]
  pendingReminders: Reminder[]
}

/**
 * Vital summary data
 */
export interface VitalSummary {
  totalRecords: number
  latestRecords: Record<VitalType, VitalSignsData | null>
  trends: Record<VitalType, 'improving' | 'stable' | 'declining'>
}

/**
 * Journal insights data
 */
export interface JournalInsights {
  totalNotes: number
  totalEvents: number
  recentActivity: number
  moodTrend?: 'positive' | 'neutral' | 'negative'
}

// =============================================================================
// JOURNAL TYPES
// =============================================================================

/**
 * Journal note interface
 */
export interface JournalNote {
  id: string
  title: string
  content: string
  isImportant: boolean
  userId: string
  subcategoryId?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

/**
 * Journal note creation payload
 */
export interface CreateJournalNoteRequest {
  title: string
  content: string
  isImportant?: boolean
  userId: string
  subcategoryId?: string
  tags?: string[]
}

/**
 * Journal note update payload
 */
export interface UpdateJournalNoteRequest extends CreateJournalNoteRequest {
  id: string
}

/**
 * Journal event interface
 */
export interface JournalEvent {
  id: string
  title: string
  description?: string
  eventDate: string
  eventType: 'activity' | 'observation' | 'milestone' | 'other'
  isImportant: boolean
  userId: string
  subcategoryId?: string
  attachments: string[]
  createdAt: string
  updatedAt: string
}

/**
 * Journal event creation payload
 */
export interface CreateJournalEventRequest {
  title: string
  description?: string
  eventDate: string
  eventType: 'activity' | 'observation' | 'milestone' | 'other'
  isImportant?: boolean
  userId: string
  subcategoryId?: string
  attachments?: string[]
}

/**
 * Journal event update payload
 */
export interface UpdateJournalEventRequest extends CreateJournalEventRequest {
  id: string
}

/**
 * Subcategory interface
 */
export interface Subcategory {
  id: string
  name: string
  description?: string
  type: 'activity' | 'observation'
  color?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Subcategory creation payload
 */
export interface CreateSubcategoryRequest {
  name: string
  description?: string
  type: 'activity' | 'observation'
  color?: string
}

/**
 * Subcategory update payload
 */
export interface UpdateSubcategoryRequest extends CreateSubcategoryRequest {
  id: string
}

/**
 * Journal filter parameters
 */
export interface JournalFilterParams {
  startDate?: string
  endDate?: string
  isImportant?: boolean
  subcategoryId?: string
  tags?: string[]
  userId?: string
  limit?: number
  offset?: number
}

/**
 * Importance toggle request
 */
export interface ToggleImportanceRequest {
  id: string
  isImportant: boolean
}

// =============================================================================
// GRAPH AND CONTACT TYPES
// =============================================================================

/**
 * Graph data filter parameters
 */
export interface GraphFilterParams {
  vitalType: VitalType
  startDate?: string
  endDate?: string
  userId?: string
  granularity?: 'daily' | 'weekly' | 'monthly'
}

/**
 * Graph data point
 */
export interface GraphDataPoint {
  date: string
  value: number
  label?: string
}

/**
 * Graph data response
 */
export interface GraphData {
  vitalType: VitalType
  dataPoints: GraphDataPoint[]
  unit: string
  dateRange: {
    startDate: string
    endDate: string
  }
}

/**
 * Contact interface - based on /contact/ka/list and /contact/ka/get response
 */
export interface Contact {
  id: number
  subscriberId?: number
  fname: string
  mname?: string | null
  lname: string
  phone: string
  email: string
  address1?: string | null
  address2?: string | null
  city?: string | null
  state?: string | null
  zipcode?: string | null
  country?: string | null
  notes?: string | null
  recipientId?: number
  type?: number
  profileImage?: string | null
  relationship?: number
  address?: string
  createdDate: string
  // Legacy fields for backward compatibility (from old list response)
  name?: string
  recipient?: string
  firstName?: string
  lastName?: string
  middleName?: string
  phoneNumber?: string
  isEmergencyContact?: boolean
  userId?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Contact creation payload - based on /contact/ka/add API
 */
export interface CreateContactRequest {
  id: number
  subscriberId: number
  fname: string
  mname: string
  lname: string
  phone: string
  email: string
  address1: string
  address2: string
  city: string
  state: string
  zipcode: string
  country: string
  notes: string
  recipientId: number
  type: number
  profileImage: string
  relationship: number
  address: string
  createdDate: string
}

/**
 * Contact update payload - same structure as create
 */
export interface UpdateContactRequest {
  id: number
  subscriberId: number
  fname: string
  mname: string
  lname: string
  phone: string
  email: string
  address1: string
  address2: string
  city: string
  state: string
  zipcode: string
  country: string
  notes: string
  recipientId: number
  type: number
  profileImage: string
  relationship: number
  address: string
  createdDate: string
}

/**
 * Contact list filter parameters
 */
export interface ContactListParams {
  subId?: number | null
  userId?: number | null
  recipientId?: number | null
}

/**
 * Community data interface
 */
export interface CommunityData {
  id: string
  name: string
  description?: string
  memberCount: number
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Contact filter parameters
 */
export interface ContactFilterParams {
  relationship?: string
  isEmergencyContact?: boolean
  userId?: string
}

// =============================================================================
// KARE MANAGEMENT TYPES (Based on actual API responses)
// =============================================================================

/**
 * Kare Admin interface - based on actual API response structure
 */
export interface KareAdmin {
  id: number
  fname: string
  mname: string | null
  lname: string
  email: string
  mobile: string
  address1: string | null
  address2: string | null
  city: string | null
  state: string | null
  zipcode: string | null
  country: string | null
  notes: string | null
  roleId: number
  userName: string
  subscriberId: number
  profileImage: string | null
  refreshToken: string | null
  refreshTokenExpiry: string | null
  relationship: number
  recipientId: number
  additionalRoleId: number | null
  forcePwdChange: boolean
  createdDate: string
  modifiedDate: string
  createdBy: number
  modifiedBy: number
  subscriptionType: string | null
  deleted: boolean
}

/**
 * Kare Giver interface - based on actual API response structure
 */
export interface KareGiver {
  id: number
  fname: string
  mname: string | null
  lname: string
  email: string
  mobile: string
  address1: string | null
  address2: string | null
  city: string | null
  state: string | null
  zipcode: string | null
  country: string | null
  notes: string | null
  roleId: number
  userName: string
  subscriberId: number
  profileImage: string | null
  refreshToken: string | null
  refreshTokenExpiry: string | null
  relationship: number
  recipientId: number
  additionalRoleId: number | null
  forcePwdChange: boolean
  createdDate: string
  modifiedDate: string
  createdBy: number
  modifiedBy: number
  subscriptionType: string | null
  deleted: boolean
}

/**
 * Kare Viewer interface - based on actual API response structure
 */
export interface KareViewer {
  id: number
  fname: string
  mname: string | null
  lname: string
  email: string
  mobile: string
  address1: string | null
  address2: string | null
  city: string | null
  state: string | null
  zipcode: string | null
  country: string | null
  notes: string | null
  roleId: number
  userName: string
  subscriberId: number
  profileImage: string | null
  refreshToken: string | null
  refreshTokenExpiry: string | null
  relationship: number
  recipientId: number
  additionalRoleId: number | null
  forcePwdChange: boolean
  createdDate: string
  modifiedDate: string
  createdBy: number
  modifiedBy: number
  subscriptionType: string | null
  deleted: boolean
}

/**
 * Kare Recipient interface - based on /kare-recipient/list response
 */
export interface KareRecipient {
  id: number
  relationship: string | null
  subsciber: string // Note: API has typo "subsciber" instead of "subscriber"
  name: string
  gender: string
  age: number
  email: string
  phone: string
  profileImage: string | null
  providerConnected: boolean
  providers: unknown | null
  createdDate: string
}

/**
 * Create/Update request types for Kare entities (based on actual API body structure)
 */
export interface CreateKareAdminRequest {
  id: number
  fname: string
  mname: string
  lname: string
  email: string
  mobile: string
  address1: string
  address2: string
  city: string
  state: string
  zipcode: string
  country: string
  notes: string
  recipientId: number
  relationship: number
}



export interface CreateKareGiverRequest {
  id: number
  fname: string
  mname: string
  lname: string
  email: string
  mobile: string
  address1: string
  address2: string
  city: string
  state: string
  zipcode: string
  country: string
  notes: string
  recipientId: number
  relationship: number
}



export interface CreateKareViewerRequest {
  id: number
  fname: string
  mname: string
  lname: string
  email: string
  mobile: string
  address1: string
  address2: string
  city: string
  state: string
  zipcode: string
  country: string
  notes: string
  recipientId: number
  relationship: number
}



export interface CreateKareRecipientRequest {
  id: number
  subscriberId: number
  fname: string
  mname: string
  lname: string
  gender: string
  age: number
  email: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  zipcode: string
  country: string
  notes: string
  profileImage: string
  relationship: number
  about: string
  routines: string
  preferences: string
  medications: string
  contacts: string
}



// =============================================================================
// COMMON UTILITY TYPES
// =============================================================================

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

/**
 * Sort parameters
 */
export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Base filter parameters that can be extended
 */
export interface BaseFilterParams extends PaginationParams, SortParams {
  search?: string
}

/**
 * API error response
 */
export interface ApiError {
  message: string
  code?: string
  details?: Record<string, unknown>
}

/**
 * File upload response
 */
export interface FileUploadResponse {
  url: string
  filename: string
  size: number
  mimeType: string
}

/**
 * Master Value interface - for dropdown options
 */
export interface MasterValue {
  id: number
  text: string
  description: string | null
  type: number
  isPublished: boolean
  createdDate: string
}

/**
 * Create Master Value request payload
 */
export interface CreateMasterValueRequest {
  id: number
  text: string
  description: string
  type: number
  isPublished: boolean
  createdDate: string
}

/**
 * Update Master Value request payload
 */
export interface UpdateMasterValueRequest {
  id: number
  text: string
  description: string
  type: number
  isPublished: boolean
  createdDate: string
}

/**
 * Master Value list filter parameters
 */
export interface MasterValueListParams {
  type: number | null
}

// =============================================================================
// SUBSCRIBERS MANAGEMENT
// =============================================================================

/**
 * Subscriber interface - based on actual API response structure
 */
export interface Subscriber {
  id: number
  name: string
  type: string
  orgPhone: string | null
  mobile: string
  email: string
  address: string
  createdDate: string
  isActive: boolean
}

/**
 * Create Subscriber request payload (register)
 */
export interface CreateSubscriberRequest {
  id: number
  fname: string
  mname: string
  lname: string
  type: string
  contactPersonFName: string
  contactPersonMName: string
  contactPersonLName: string
  mobile: string
  orgPhone: string
  email: string
  address1: string
  address2: string
  city: string
  state: string
  zipcode: string
  country: string
  websiteUrl: string
  pricePlanType: number
  sameAsSub: boolean
  userfname: string
  usermname: string
  userlname: string
  usermobile: string
  useremail: string
  useraddress1: string
  useraddress2: string
  usercity: string
  userstate: string
  userzipcode: string
  usercountry: string
  usernotes: string
  notes: string
}

/**
 * Update Subscriber request payload (edit)
 */
export interface UpdateSubscriberRequest {
  id: number
  fname: string
  mname: string
  lname: string
  type: string
  contactPersonFName: string
  contactPersonMName: string
  contactPersonLName: string
  mobile: string
  orgPhone: string
  email: string
  address1: string
  address2: string
  city: string
  state: string
  zipcode: string
  country: string
  websiteUrl: string
  pricePlanType: number
  sameAsSub: boolean
  userfname: string
  usermname: string
  userlname: string
  usermobile: string
  useremail: string
  useraddress1: string
  useraddress2: string
  usercity: string
  userstate: string
  userzipcode: string
  usercountry: string
  usernotes: string
  notes: string
}

/**
 * Subscriber list filter parameters
 */
export interface SubscriberListParams {
  type?: string | null
}

// =============================================================================
// PACKAGES MANAGEMENT
// =============================================================================

/**
 * Package interface - based on API response structure
 */
export interface Package {
  id: number
  name: string
  type: string
  durationInMonths: number
  noOfFamilies: number
  noOfKareReceivers: number
  noOfKareGivers: number
  noOfKareViewers: number
  isActive: boolean
}

/**
 * Create Package request payload
 */
export interface CreatePackageRequest {
  id: number
  name: string
  type: string
  durationInMonths: number
  noOfFamilies: number
  noOfKareReceivers: number
  noOfKareGivers: number
  noOfKareViewers: number
  isActive: boolean
}

/**
 * Update Package request payload
 */
export interface UpdatePackageRequest {
  id: number
  name: string
  type: string
  durationInMonths: number
  noOfFamilies: number
  noOfKareReceivers: number
  noOfKareGivers: number
  noOfKareViewers: number
  isActive: boolean
}

/**
 * Package list filter parameters
 */
export interface PackageListParams {
  type?: string | null
}

/**
 * Family Profile interface - for subscriber profile management
 */
export interface FamilyProfile {
  id?: number
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
}

/**
 * Family Profile update request
 */
export interface UpdateFamilyProfileRequest {
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
}

// =============================================================================
// VITAL TYPES MANAGEMENT
// =============================================================================

/**
 * Vital Type Entity interface - based on API payload structure
 */
export interface VitalTypeEntity {
  id: number
  name: string
  providerName: string
  isManual: boolean
  createdDate: string
}

/**
 * Create Vital Type request payload
 */
export interface CreateVitalTypeRequest {
  id: number
  name: string
  providerName: string
  isManual: boolean
  createdDate: string
}

/**
 * Update Vital Type request payload
 */
export interface UpdateVitalTypeRequest {
  id: number
  name: string
  providerName: string
  isManual: boolean
  createdDate: string
}