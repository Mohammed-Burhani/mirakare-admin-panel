"use client"

import { useState } from "react"
import Container from "@/components/layout/container"
import { PageHeader } from "@/components/page-header"
import { Module } from "@/lib/utils/permissions"
import { PermissionGuard } from "@/components/auth/PermissionGuard"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { EmptyState } from "@/components/empty-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ViewToggle } from "@/components/view-toggle"
import { SearchBar } from "@/components/search-bar"
import { FilterSection } from "@/components/filter-section"
import { DataTable, ColumnDef } from "@/components/data-table"
import { useAdminRoles } from "@/lib/hooks/useAdministration"
import { AdminRole } from "@/lib/api/types"
import { 
  IconShield, 
  IconCalendar, 
  IconSettings,
  IconShieldCheck,
  IconUser,
  IconUsers,
  IconBuilding,
  IconCrown
} from "@tabler/icons-react"

export default function AdminRolesPage() {
  return (
    <PermissionGuard module={Module.ADMIN_ROLES}>
      <AdminRolesPageContent />
    </PermissionGuard>
  )
}

function AdminRolesPageContent() {
  const { data: roles = [], isLoading, error } = useAdminRoles()
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<"card" | "table">("card")

  const filteredRoles = roles.filter((role: AdminRole) => {
    const query = searchQuery.toLowerCase()
    return (
      (role.name && role.name.toLowerCase().includes(query)) ||
      (role.type && role.type.toLowerCase().includes(query))
    )
  })

  const getRoleIcon = (type: string, name: string) => {
    if (type.toLowerCase() === 'system' || name.toLowerCase().includes('system')) {
      return <IconCrown className="h-6 w-6" />
    }
    if (name.toLowerCase().includes('admin')) {
      return <IconShieldCheck className="h-6 w-6" />
    }
    if (name.toLowerCase().includes('family')) {
      return <IconUsers className="h-6 w-6" />
    }
    if (name.toLowerCase().includes('organization')) {
      return <IconBuilding className="h-6 w-6" />
    }
    return <IconUser className="h-6 w-6" />
  }

  const getRoleColor = (type: string, name: string) => {
    if (type.toLowerCase() === 'system' || name.toLowerCase().includes('system')) {
      return {
        bg: 'bg-red-50',
        text: 'text-red-600',
        border: 'border-red-200',
        badge: 'bg-red-100 text-red-800 border-red-200'
      }
    }
    if (name.toLowerCase().includes('admin')) {
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        badge: 'bg-blue-100 text-blue-800 border-blue-200'
      }
    }
    if (name.toLowerCase().includes('family')) {
      return {
        bg: 'bg-green-50',
        text: 'text-green-600',
        border: 'border-green-200',
        badge: 'bg-green-100 text-green-800 border-green-200'
      }
    }
    if (name.toLowerCase().includes('organization')) {
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200',
        badge: 'bg-purple-100 text-purple-800 border-purple-200'
      }
    }
    return {
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      border: 'border-gray-200',
      badge: 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const isPreDefined = (type: string) => {
    return type.toLowerCase() === 'system' || type.toLowerCase() === 'admin'
  }

  const columns: ColumnDef<AdminRole>[] = [
    {
      accessorKey: "name",
      header: "Role",
      cell: (row) => {
        const colors = getRoleColor(row.type, row.name)
        return (
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border`}>
              <div className={colors.text}>
                {getRoleIcon(row.type, row.name)}
              </div>
            </div>
            <div>
              <div className="font-medium">{row.name}</div>
              <div className="text-sm text-muted-foreground">Role Type: {row.type}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "type",
      header: "Is Pre Defined",
      cell: (row) => (
        <Badge className={`${getRoleColor(row.type, row.name).badge} flex items-center gap-1 w-fit`}>
          {isPreDefined(row.type) ? (
            <>
              <IconShieldCheck className="h-3 w-3" />
              Yes
            </>
          ) : (
            <>
              <IconSettings className="h-3 w-3" />
              No
            </>
          )}
        </Badge>
      ),
    },
    {
      accessorKey: "createdDate",
      header: "Created",
      cell: (row) => (
        <div className="flex items-center gap-2 text-sm">
          <IconCalendar className="h-3 w-3 text-muted-foreground" />
          {new Date(row.createdDate).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: (row) => (
        <Badge variant={row.isActive ? "default" : "secondary"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ]

  if (isLoading) {
    return (
      <Container>
        <LoadingState message="Loading system roles..." />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorState message="Failed to load system roles" />
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <FilterSection>
          <PageHeader
            title="System Roles"
            description="View and manage system roles and permissions"
            actions={
              <ViewToggle view={view} onViewChange={setView} />
            }
          />
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by role name or type..."
          />
        </FilterSection>

        {/* Table View */}
        {view === "table" && (
          <div className="px-4 lg:px-6">
            {filteredRoles.length === 0 ? (
              <EmptyState
                icon={<IconShield className="text-muted-foreground h-10 w-10" />}
                title="No roles found"
                description={
                  searchQuery
                    ? "Try adjusting your search query"
                    : "No system roles are currently available"
                }
              />
            ) : (
              <div className="rounded-md border">
                <DataTable
                  columns={columns}
                  data={filteredRoles}
                />
              </div>
            )}
          </div>
        )}

        {/* Card View */}
        {view === "card" && (
          <div className="px-4 lg:px-6">
            {filteredRoles.length === 0 ? (
              <EmptyState
                icon={<IconShield className="text-muted-foreground h-10 w-10" />}
                title="No roles found"
                description={
                  searchQuery
                    ? "Try adjusting your search query"
                    : "No system roles are currently available"
                }
              />
            ) : (
              <div className="grid gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
                {filteredRoles.map((role) => {
                  const colors = getRoleColor(role.type, role.name)
                  return (
                    <Card
                      key={role.id}
                      className={`group relative overflow-hidden transition-all hover:shadow-lg ${colors.border} border-2`}
                    >
                      {/* Status Badge */}
                      <div className="absolute right-4 top-8 z-10">
                        <Badge variant={role.isActive ? "default" : "secondary"}>
                          {role.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <CardHeader className={`${colors.bg} py-4`}>
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl bg-white/80 ${colors.border} border`}>
                            <div className={colors.text}>
                              {getRoleIcon(role.type, role.name)}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-lg truncate">
                              {role.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {role.type} Role
                            </p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Pre-defined Status */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Pre-defined Role</span>
                            <Badge className={`${colors.badge} flex items-center gap-1`}>
                              {isPreDefined(role.type) ? (
                                <>
                                  <IconShieldCheck className="h-3 w-3" />
                                  Yes
                                </>
                              ) : (
                                <>
                                  <IconSettings className="h-3 w-3" />
                                  No
                                </>
                              )}
                            </Badge>
                          </div>

                          {/* Created Date */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Created Date</span>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <IconCalendar className="h-3 w-3" />
                              {new Date(role.createdDate).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Role Description */}
                          <div className="pt-2 border-t">
                            <p className="text-sm text-muted-foreground">
                              {isPreDefined(role.type) 
                                ? "This is a system-defined role with predefined permissions."
                                : "This is a custom role with configurable permissions."
                              }
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  )
}