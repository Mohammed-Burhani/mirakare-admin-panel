"use client"

import Container from "@/components/layout/container"
import { PageHeader } from "@/components/page-header"
import { Module } from "@/lib/utils/permissions"
import { PermissionGuard } from "@/components/auth/PermissionGuard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useAdminUsers, useAdminRoles } from "@/lib/hooks/useAdministration"
import { 
  IconUsers, 
  IconShield, 
  IconArrowRight,
  IconTrendingUp,
  IconActivity
} from "@tabler/icons-react"

export default function AdministrationPage() {
  return (
    <PermissionGuard module={Module.ADMINISTRATIONS}>
      <AdministrationPageContent />
    </PermissionGuard>
  )
}

function AdministrationPageContent() {
  const router = useRouter()
  const { data: users = [] } = useAdminUsers()
  const { data: roles = [] } = useAdminRoles()

  const adminModules = [
    {
      title: "System Users",
      description: "View and manage system user accounts",
      icon: <IconUsers className="h-8 w-8" />,
      path: "/administration/users",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      count: users.length,
      countLabel: "Total Users",
      stats: {
        active: users.filter(u => u.isActive).length,
        inactive: users.filter(u => !u.isActive).length,
      }
    },
    {
      title: "System Roles",
      description: "View and manage system roles and permissions",
      icon: <IconShield className="h-8 w-8" />,
      path: "/administration/roles",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      count: roles.length,
      countLabel: "Total Roles",
      stats: {
        predefined: roles.filter(r => r.type.toLowerCase() === 'system' || r.type.toLowerCase() === 'admin').length,
        custom: roles.filter(r => r.type.toLowerCase() !== 'system' && r.type.toLowerCase() !== 'admin').length,
      }
    },
  ]

  return (
    <Container>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <PageHeader
            title="Administration"
            description="Manage system users, roles, and permissions"
          />
        </div>

        {/* Overview Stats */}
        <div className="px-4 lg:px-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IconUsers className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Total Users</p>
                    <p className="text-2xl font-bold text-blue-600">{users.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <IconShield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900">Total Roles</p>
                    <p className="text-2xl font-bold text-green-600">{roles.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <IconActivity className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-900">Active Users</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {users.filter(u => u.isActive).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <IconTrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-900">System Roles</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {roles.filter(r => r.type.toLowerCase() === 'system' || r.type.toLowerCase() === 'admin').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Module Cards */}
        <div className="px-4 lg:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {adminModules.map((module) => (
              <Card
                key={module.title}
                className={`group relative overflow-hidden transition-all hover:shadow-lg cursor-pointer ${module.borderColor} border-2`}
                onClick={() => router.push(module.path)}
              >
                <CardHeader className={`${module.bgColor} pb-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/80 rounded-xl border border-white/50">
                        <div className={module.color}>
                          {module.icon}
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-xl">{module.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {module.description}
                        </p>
                      </div>
                    </div>
                    <IconArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Main Count */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{module.countLabel}</span>
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {module.count}
                      </Badge>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      {module.title === "System Users" ? (
                        <>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{module.stats.active}</p>
                            <p className="text-xs text-muted-foreground">Active</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-500">{module.stats.inactive}</p>
                            <p className="text-xs text-muted-foreground">Inactive</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{module.stats.predefined}</p>
                            <p className="text-xs text-muted-foreground">Pre-defined</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{module.stats.custom}</p>
                            <p className="text-xs text-muted-foreground">Custom</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      View {module.title}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}