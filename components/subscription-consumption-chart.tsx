"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SubscriptionConsumptionData } from "@/lib/api/types"
import { 
  IconHome,
  IconHeart,
  IconUsers,
  IconEye
} from "@tabler/icons-react"

interface SubscriptionConsumptionChartProps {
  data: SubscriptionConsumptionData[]
}

export function SubscriptionConsumptionChart({ data }: SubscriptionConsumptionChartProps) {
  // Calculate usage percentages
  const getUsagePercentage = (used: number, available: number) => {
    if (available === 0) return 0
    return Math.round((used / available) * 100)
  }

  // Get usage status color
  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "destructive"
    if (percentage >= 70) return "secondary" 
    return "default"
  }

  // Aggregate totals across all subscriptions
  const totals = data.reduce(
    (acc, item) => ({
      families: {
        used: acc.families.used + item.totalUsedFamilies,
        available: acc.families.available + item.totalAvailFamilies,
      },
      receivers: {
        used: acc.receivers.used + item.totalUsedReceivers,
        available: acc.receivers.available + item.totalAvailReceivers,
      },
      givers: {
        used: acc.givers.used + item.totalUsedGivers,
        available: acc.givers.available + item.totalAvailGivers,
      },
      viewers: {
        used: acc.viewers.used + item.totalUsedViewers,
        available: acc.viewers.available + item.totalAvailViewers,
      },
    }),
    {
      families: { used: 0, available: 0 },
      receivers: { used: 0, available: 0 },
      givers: { used: 0, available: 0 },
      viewers: { used: 0, available: 0 },
    }
  )

  const usageMetrics = [
    {
      title: "Families",
      icon: <IconHome className="h-5 w-5" />,
      used: totals.families.used,
      available: totals.families.available,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Receivers", 
      icon: <IconHeart className="h-5 w-5" />,
      used: totals.receivers.used,
      available: totals.receivers.available,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Givers",
      icon: <IconUsers className="h-5 w-5" />,
      used: totals.givers.used,
      available: totals.givers.available,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Viewers",
      icon: <IconEye className="h-5 w-5" />,
      used: totals.viewers.used,
      available: totals.viewers.available,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {usageMetrics.map((metric) => {
        const percentage = getUsagePercentage(metric.used, metric.available)
        const variant = getUsageColor(percentage)
        
        return (
          <Card key={metric.title}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <div className={metric.color}>
                      {metric.icon}
                    </div>
                  </div>
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                </div>
                <Badge variant={variant} className="text-xs">
                  {percentage}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="font-medium">
                    {metric.used} / {metric.available}
                  </span>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  {metric.available - metric.used} remaining
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}