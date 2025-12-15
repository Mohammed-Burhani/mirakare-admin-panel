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
 * Contact interface
 */
export interface Contact {
  id: string
  firstName: string
  lastName: string
  email?: string
  phoneNumber?: string
  relationship: string
  isEmergencyContact: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

/**
 * Contact creation payload
 */
export interface CreateContactRequest {
  firstName: string
  lastName: string
  email?: string
  phoneNumber?: string
  relationship: string
  isEmergencyContact?: boolean
  userId: string
}

/**
 * Contact update payload
 */
export interface UpdateContactRequest extends CreateContactRequest {
  id: string
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
 * Kare Admin interface - based on /user/org/kare-admin/list response
 */
export interface KareAdmin {
  id: number
  recipientId: number
  recipient: string | null
  name: string
  email: string
  mobile: string
  subscriber: string
  createdDate: string
  additionalRole: string | null
}

/**
 * Kare Giver interface - based on /user/kare-admin/kare-giver/list response
 */
export interface KareGiver {
  id: number
  recipientId: number
  recipient: string | null
  name: string
  email: string
  mobile: string
  subscriber: string
  createdDate: string
  additionalRole: string | null
}

/**
 * Kare Viewer interface - based on /user/kare-admin/viewer/list response
 */
export interface KareViewer {
  id: number
  recipientId: number
  recipient: string | null
  name: string
  email: string
  mobile: string
  subscriber: string | null
  createdDate: string
  additionalRole: string | null
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
 * Create/Update request types for Kare entities
 */
export interface CreateKareAdminRequest {
  name: string
  email: string
  mobile: string
  recipientId?: number
}

export interface UpdateKareAdminRequest extends CreateKareAdminRequest {
  id: number
}

export interface CreateKareGiverRequest {
  name: string
  email: string
  mobile: string
  recipientId?: number
}

export interface UpdateKareGiverRequest extends CreateKareGiverRequest {
  id: number
}

export interface CreateKareViewerRequest {
  name: string
  email: string
  mobile: string
  recipientId?: number
}

export interface UpdateKareViewerRequest extends CreateKareViewerRequest {
  id: number
}

export interface CreateKareRecipientRequest {
  name: string
  gender: string
  age: number
  email?: string
  phone?: string
  relationship?: string
}

export interface UpdateKareRecipientRequest extends CreateKareRecipientRequest {
  id: number
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