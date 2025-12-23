"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { canAccessModule, Module, Permission, hasPermission } from "@/lib/utils/permissions"
import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"

interface PermissionGuardProps {
  children: React.ReactNode
  module: Module
  permission?: Permission
  fallback?: React.ReactNode
}

/**
 * PermissionGuard component that protects routes and components based on user permissions
 * 
 * @param children - The component to render if user has permission
 * @param module - The module to check permission for
 * @param permission - Specific permission to check (optional, defaults to checking module access)
 * @param fallback - Custom fallback component to render if no permission (optional)
 */
export function PermissionGuard({ 
  children, 
  module, 
  permission, 
  fallback 
}: PermissionGuardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    // Check if user has access to the module
    const moduleAccess = canAccessModule(module)
    
    // If specific permission is required, check for that
    const permissionAccess = permission ? hasPermission(module, permission) : true
    
    const access = moduleAccess && permissionAccess
    setHasAccess(access)
    setIsLoading(false)

    // Redirect to dashboard if no access and no custom fallback
    if (!access && !fallback) {
      router.push("/")
    }
  }, [module, permission, router, fallback])

  if (isLoading) {
    return <LoadingState message="Checking permissions..." />
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }
    
    return (
      <ErrorState
        title="Access Denied"
        description="You don't have permission to access this module."
        action={{
          label: "Go to Dashboard",
          onClick: () => router.push("/")
        }}
      />
    )
  }

  return <>{children}</>
}

/**
 * Hook to check permissions in components
 */
export function usePermissions(module: Module) {
  return {
    canAccess: canAccessModule(module),
    canCreate: hasPermission(module, Permission.CREATE) || hasPermission(module, Permission.ALL),
    canUpdate: hasPermission(module, Permission.UPDATE) || hasPermission(module, Permission.ALL),
    canDelete: hasPermission(module, Permission.DELETE) || hasPermission(module, Permission.ALL),
    canRead: hasPermission(module, Permission.READ) || hasPermission(module, Permission.ALL),
  }
}