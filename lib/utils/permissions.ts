// Role-based access control utilities
// This file defines user roles and their permissions

// =============================================================================
// USER ROLES
// =============================================================================

export enum UserRole {
  SYSTEM_ADMIN = 'System Admin',
  ORG_ADMIN = 'Org Admin',
  KARE_ADMIN = 'Kare Admin',
  KARE_GIVER = 'Kare Giver',
  KARE_VIEWER = 'Kare Viewer',
  KARE_RECIPIENT = 'Kare Recipient',
}

// =============================================================================
// PERMISSION TYPES
// =============================================================================

export enum Permission {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  ALL = 'all', // Shorthand for all CRUD operations
}

// =============================================================================
// MODULE DEFINITIONS
// =============================================================================

export enum Module {
  DASHBOARD = 'dashboard',
  ORGANIZATION_PROFILE = 'organization-profile',
  FAMILY_PROFILE = 'family-profile',
  KARE_ADMINS = 'kare-admins',
  KARE_RECIPIENTS = 'kare-recipients',
  KARE_GIVERS = 'kare-givers',
  KARE_VIEWERS = 'kare-viewers',
  CONTACTS = 'contacts',
  REPORTS = 'reports',
  VITAL_TYPES = 'vital-types',
  MASTER_VALUES = 'master-values',
  SUBSCRIBERS = 'subscribers',
  PACKAGES = 'packages',
  ADMINISTRATIONS = 'administrations',
}

// =============================================================================
// ROLE PERMISSIONS MAPPING
// =============================================================================

type RolePermissions = {
  [key in UserRole]: {
    [key in Module]?: Permission[]
  }
}

export const ROLE_PERMISSIONS: RolePermissions = {
  [UserRole.SYSTEM_ADMIN]: {
    [Module.DASHBOARD]: [Permission.READ],
    [Module.VITAL_TYPES]: [Permission.ALL],
    [Module.MASTER_VALUES]: [Permission.ALL],
    [Module.SUBSCRIBERS]: [Permission.ALL],
    [Module.PACKAGES]: [Permission.ALL],
    [Module.KARE_ADMINS]: [Permission.READ],
    [Module.KARE_GIVERS]: [Permission.READ],
    [Module.KARE_RECIPIENTS]: [Permission.READ],
    [Module.REPORTS]: [Permission.READ],
    [Module.ADMINISTRATIONS]: [Permission.READ],
  },
  [UserRole.ORG_ADMIN]: {
    [Module.DASHBOARD]: [Permission.READ],
    [Module.ORGANIZATION_PROFILE]: [Permission.ALL],
    [Module.KARE_ADMINS]: [Permission.ALL],
    [Module.REPORTS]: [Permission.READ],
  },
  [UserRole.KARE_ADMIN]: {
    [Module.DASHBOARD]: [Permission.READ],
    [Module.FAMILY_PROFILE]: [Permission.ALL],
    [Module.KARE_ADMINS]: [Permission.ALL],
    [Module.KARE_RECIPIENTS]: [Permission.ALL],
    [Module.KARE_GIVERS]: [Permission.ALL],
    [Module.KARE_VIEWERS]: [Permission.ALL],
    [Module.CONTACTS]: [Permission.ALL],
    [Module.REPORTS]: [Permission.READ],
  },
  [UserRole.KARE_GIVER]: {
    // Will be defined later
  },
  [UserRole.KARE_VIEWER]: {
    // Will be defined later
  },
  [UserRole.KARE_RECIPIENT]: {
    // Will be defined later
  },
}

// =============================================================================
// PERMISSION UTILITY FUNCTIONS
// =============================================================================

/**
 * Get user role from localStorage or auth context
 */
export function getUserRole(): UserRole | null {
  if (typeof window === 'undefined') return null
  
  const role = localStorage.getItem('userRole')
  return role as UserRole || null
}

/**
 * Check if user has permission for a specific module and action
 */
export function hasPermission(module: Module, permission: Permission): boolean {
  const userRole = getUserRole()
  if (!userRole) return false

  const rolePermissions = ROLE_PERMISSIONS[userRole]
  if (!rolePermissions) return false

  const modulePermissions = rolePermissions[module]
  if (!modulePermissions) return false

  // Check if user has the specific permission or ALL permissions
  return modulePermissions.includes(permission) || modulePermissions.includes(Permission.ALL)
}

/**
 * Check if user can access a module (has any permission)
 */
export function canAccessModule(module: Module): boolean {
  const userRole = getUserRole()
  if (!userRole) return false

  const rolePermissions = ROLE_PERMISSIONS[userRole]
  if (!rolePermissions) return false

  return !!rolePermissions[module]
}

/**
 * Check if user can create in a module
 */
export function canCreate(module: Module): boolean {
  return hasPermission(module, Permission.CREATE) || hasPermission(module, Permission.ALL)
}

/**
 * Check if user can update in a module
 */
export function canUpdate(module: Module): boolean {
  return hasPermission(module, Permission.UPDATE) || hasPermission(module, Permission.ALL)
}

/**
 * Check if user can delete in a module
 */
export function canDelete(module: Module): boolean {
  return hasPermission(module, Permission.DELETE) || hasPermission(module, Permission.ALL)
}

/**
 * Check if user can read in a module
 */
export function canRead(module: Module): boolean {
  return hasPermission(module, Permission.READ) || hasPermission(module, Permission.ALL)
}

/**
 * Get all accessible modules for current user
 */
export function getAccessibleModules(): Module[] {
  const userRole = getUserRole()
  if (!userRole) return []

  const rolePermissions = ROLE_PERMISSIONS[userRole]
  if (!rolePermissions) return []

  return Object.keys(rolePermissions) as Module[]
}

/**
 * Check if current user is Org Admin
 */
export function isOrgAdmin(): boolean {
  return getUserRole() === UserRole.ORG_ADMIN
}

/**
 * Check if current user is System Admin
 */
export function isSystemAdmin(): boolean {
  return getUserRole() === UserRole.SYSTEM_ADMIN
}

/**
 * Check if current user is Kare Admin
 */
export function isKareAdmin(): boolean {
  return getUserRole() === UserRole.KARE_ADMIN
}