"use client"

import Container from "@/components/layout/container"
import { PageHeader } from "@/components/page-header"
import { Module } from "@/lib/utils/permissions"
import { PermissionGuard } from "@/components/auth/PermissionGuard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { 
  IconTrendingUp, 
  IconActivity, 
  IconArrowRight,
  IconChartBar
} from "@tabler/icons-react"

export default function ReportsPage() {
  return (
    <PermissionGuard module={Module.REPORTS}>
      <ReportsPageContent />
    </PermissionGuard>
  )
}

function ReportsPageContent() {
  const router = useRouter()

  const reportModules = [
    {
      title: "Vital Stats",
      description: "View and analyze vital signs data with interactive charts and detailed reports",
      icon: <IconActivity className="h-8 w-8" />,
      path: "/reports/vital-stats",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Subscription Consumption",
      description: "Monitor subscription usage and consumption analytics",
      icon: <IconChartBar className="h-8 w-8" />,
      path: "/reports/subscription-consumption",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
  ]

  return (
    <Container>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <PageHeader
            title="Reports"
            description="Access comprehensive reports and analytics for vital signs and system usage"
          />
        </div>

        <div className="px-4 lg:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {reportModules.map((module) => (
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    <IconTrendingUp className="h-4 w-4 mr-2" />
                    View {module.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
