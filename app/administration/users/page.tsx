"use client"

import { useState } from "react"
import Container from "@/components/layout/container"
import { PageHeader } from "@/components/page-header"
import { Module } from "@/lib/utils/permissions"
import { PermissionGuard } from "@/components/auth/PermissionGuard"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { EmptyState } from "@/components/empty-state"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ViewToggle } from "@/components/view-toggle"
import { SearchBar } from "@/components/search-bar"
import { FilterSection } from "@/components/filter-section"
import { DataTable, ColumnDef } from "@/components/data-table"
import { useAdminUsers } from "@/lib/hooks/useAdministration"
import { AdminUser } from "@/lib/api/types"
import { 
  IconUsers, 
  IconMail, 
  IconPhone, 
  IconCalendar, 
  IconUser,
  IconShieldCheck,
  IconBuilding
} from "@tabler/icons-react"

export default function AdminUsersPage() {
  return (
    <PermissionGuard module={Module.ADMIN_USERS}>
      <AdminUsersPageContent />
    </PermissionGuard>
  )
}

function AdminUsersPageContent() {
  const { data: users = [], isLoading, error } = useAdminUsers()
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<"card" | "table">("card")

  const filteredUsers = users.filter((user: AdminUser) => {
    const query = searchQuery.toLowerCase()
    return (
      (user.name && user.name.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.mobile && user.mobile.includes(query)) ||
      (user.type && user.type.toLowerCase().includes(query))
    )
  })

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'system':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'family':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'organization':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRoleIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'system':
        return <IconShieldCheck className="h-4 w-4" />
      case 'admin':
        return <IconUser className="h-4 w-4" />
      case 'family':
        return <IconUsers className="h-4 w-4" />
      case 'organization':
        return <IconBuilding className="h-4 w-4" />
      default:
        return <IconUser className="h-4 w-4" />
    }
  }

  const columns: ColumnDef<AdminUser>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(row.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-muted-foreground">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Role",
      cell: (row) => (
        <Badge className={`${getRoleColor(row.type)} flex items-center gap-1 w-fit`}>
          {getRoleIcon(row.type)}
          {row.type}
        </Badge>
      ),
    },
    {
      accessorKey: "mobile",
      header: "Contact",
      cell: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <IconPhone className="h-3 w-3 text-muted-foreground" />
            {row.mobile}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconMail className="h-3 w-3" />
            {row.email}
          </div>
        </div>
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
        <LoadingState message="Loading system users..." />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorState message="Failed to load system users" />
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <FilterSection>
          <PageHeader
            title="System Users"
            description="View and manage system user accounts"
            actions={
              <ViewToggle view={view} onViewChange={setView} />
            }
          />
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, email, mobile, or role..."
          />
        </FilterSection>

        {/* Table View */}
        {view === "table" && (
          <div className="px-4 lg:px-6">
            {filteredUsers.length === 0 ? (
              <EmptyState
                icon={<IconUsers className="text-muted-foreground h-10 w-10" />}
                title="No users found"
                description={
                  searchQuery
                    ? "Try adjusting your search query"
                    : "No system users are currently available"
                }
              />
            ) : (
              <div className="rounded-md border">
                <DataTable
                  columns={columns}
                  data={filteredUsers}
                />
              </div>
            )}
          </div>
        )}

        {/* Card View */}
        {view === "card" && (
          <div className="px-4 lg:px-6">
            {filteredUsers.length === 0 ? (
              <EmptyState
                icon={<IconUsers className="text-muted-foreground h-10 w-10" />}
                title="No users found"
                description={
                  searchQuery
                    ? "Try adjusting your search query"
                    : "No system users are currently available"
                }
              />
            ) : (
              <div className="grid gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
                {filteredUsers.map((user) => (
                  <Card
                    key={user.id}
                    className="group relative overflow-hidden transition-all hover:shadow-lg"
                  >
                    {/* Status Badge */}
                    <div className="absolute right-4 top-4 z-10">
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <CardContent className="p-6">
                      {/* Profile Section */}
                      <div className="mb-4 flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-xl font-semibold">
                            {user.name}
                          </h3>
                          <div className="mt-2">
                            <Badge className={`${getRoleColor(user.type)} flex items-center gap-1 w-fit`}>
                              {getRoleIcon(user.type)}
                              {user.type}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-3 border-t pt-4">
                        <div className="flex items-center gap-3">
                          <IconMail className="text-muted-foreground h-4 w-4 shrink-0" />
                          <span className="truncate text-sm">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <IconPhone className="text-muted-foreground h-4 w-4 shrink-0" />
                          <span className="text-sm">{user.mobile}</span>
                        </div>
                        {user.address && (
                          <div className="flex items-start gap-3">
                            <IconBuilding className="text-muted-foreground h-4 w-4 shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground line-clamp-2">
                              {user.address}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <IconCalendar className="text-muted-foreground h-4 w-4 shrink-0" />
                          <span className="text-muted-foreground text-sm">
                            Created: {new Date(user.createdDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  )
}