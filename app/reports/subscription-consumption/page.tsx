"use client"

import { useState } from "react"
import Container from "@/components/layout/container"
import { PageHeader } from "@/components/page-header"
import { Module } from "@/lib/utils/permissions"
import { PermissionGuard } from "@/components/auth/PermissionGuard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable, ColumnDef } from "@/components/data-table"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { EmptyState } from "@/components/empty-state"
import { useSubscriptionConsumption } from "@/lib/hooks/useSubscriptionConsumption"
import { SubscriptionConsumptionData } from "@/lib/api/types"
import { 
  IconFileSpreadsheet, 
  IconChartBar,
  IconSearch,
  IconX
} from "@tabler/icons-react"
import { SubscriptionConsumptionChart } from "@/components/subscription-consumption-chart"

export default function SubscriptionConsumptionPage() {
  return (
    <PermissionGuard module={Module.REPORTS}>
      <SubscriptionConsumptionPageContent />
    </PermissionGuard>
  )
}

function SubscriptionConsumptionPageContent() {
  const [searchQuery, setSearchQuery] = useState("")
  
  const { 
    data: consumptionData = [], 
    isLoading, 
    error,
    refetch 
  } = useSubscriptionConsumption()

  const handleSearch = () => {
    refetch()
  }

  const handleClear = () => {
    setSearchQuery("")
  }

  const handleExport = () => {
    if (filteredData.length === 0) {
      alert("No data to export")
      return
    }

    // Prepare data for export
    const exportData = filteredData.map((item: SubscriptionConsumptionData) => ({
      'Name': item.name,
      'Type': item.type,
      'Plan': item.planName,
      'Is Active': item.isActive ? 'Yes' : 'No',
      'Start Date': new Date(item.startDate).toLocaleDateString(),
      'End Date': new Date(item.endDate).toLocaleDateString(),
      'Families Available': item.totalAvailFamilies,
      'Families Used': item.totalUsedFamilies,
      'Receivers Available': item.totalAvailReceivers,
      'Receivers Used': item.totalUsedReceivers,
      'Givers Available': item.totalAvailGivers,
      'Givers Used': item.totalUsedGivers,
      'Viewers Available': item.totalAvailViewers,
      'Viewers Used': item.totalUsedViewers,
    }))

    // Convert to CSV format
    const headers = Object.keys(exportData[0])
    const csvContent = [
      headers.join(','),
      ...exportData.map((row: Record<string, string | number>) => 
        headers.map(header => `"${row[header]}"`).join(',')
      )
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `subscription-consumption-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter data based on search query
  const filteredData = consumptionData.filter((item: SubscriptionConsumptionData) => {
    const query = searchQuery.toLowerCase()
    return (
      item.name.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      item.planName.toLowerCase().includes(query)
    )
  })

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

  const columns: ColumnDef<SubscriptionConsumptionData>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (row) => (
        <div className="font-medium">
          {row.name}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: (row) => (
        <Badge variant="outline">
          {row.type}
        </Badge>
      ),
    },
    {
      accessorKey: "planName",
      header: "Plan",
      cell: (row) => row.planName,
    },
    {
      accessorKey: "isActive",
      header: "Is Active",
      cell: (row) => (
        <Badge variant={row.isActive ? "default" : "secondary"}>
          {row.isActive ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: (row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: (row) => new Date(row.endDate).toLocaleDateString(),
    },
    {
      accessorKey: "totalAvailFamilies",
      header: "Families Available",
      cell: (row) => row.totalAvailFamilies,
    },
    {
      accessorKey: "totalUsedFamilies",
      header: "Families Used",
      cell: (row) => {
        const percentage = getUsagePercentage(row.totalUsedFamilies, row.totalAvailFamilies)
        return (
          <div className="flex items-center gap-2">
            <span>{row.totalUsedFamilies}</span>
            <Badge variant={getUsageColor(percentage)} className="text-xs">
              {percentage}%
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "totalUsedReceivers",
      header: "Receivers",
      cell: (row) => {
        const percentage = getUsagePercentage(row.totalUsedReceivers, row.totalAvailReceivers)
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm">{row.totalUsedReceivers}/{row.totalAvailReceivers}</span>
              <Badge variant={getUsageColor(percentage)} className="text-xs">
                {percentage}%
              </Badge>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "totalUsedGivers",
      header: "Givers",
      cell: (row) => {
        const percentage = getUsagePercentage(row.totalUsedGivers, row.totalAvailGivers)
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm">{row.totalUsedGivers}/{row.totalAvailGivers}</span>
              <Badge variant={getUsageColor(percentage)} className="text-xs">
                {percentage}%
              </Badge>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "totalUsedViewers",
      header: "Viewers",
      cell: (row) => {
        const percentage = getUsagePercentage(row.totalUsedViewers, row.totalAvailViewers)
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm">{row.totalUsedViewers}/{row.totalAvailViewers}</span>
              <Badge variant={getUsageColor(percentage)} className="text-xs">
                {percentage}%
              </Badge>
            </div>
          </div>
        )
      },
    },
  ]

  return (
    <Container>
      <div className="flex flex-col gap-6 py-4 md:py-6">
        {/* Page Header */}
        <div className="px-4 lg:px-6">
          <PageHeader
            title="Subscription Consumption Report"
            description="Monitor subscription usage and consumption across families, receivers, givers, and viewers"
          />
        </div>

        {/* Filters Section */}
        <Card className="mx-4 lg:mx-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconChartBar className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-end">
              <div className="w-full space-y-2 md:w-auto md:flex-1">
                <label className="text-sm font-medium">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, type, or plan..."
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                />
              </div>

              <div className="flex w-full gap-2 md:w-auto">
                <Button 
                  onClick={handleSearch} 
                  className="flex-1 md:flex-none gap-2"
                  disabled={isLoading}
                >
                  <IconSearch className="h-4 w-4" />
                  Search
                </Button>

                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="flex-1 md:flex-none gap-2"
                >
                  <IconX className="h-4 w-4" />
                  Clear
                </Button>

                <Button
                  variant="default"
                  onClick={handleExport}
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700 md:flex-none"
                  disabled={filteredData.length === 0}
                >
                  <IconFileSpreadsheet className="h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Charts */}
        {filteredData.length > 0 && !isLoading && (
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconChartBar className="h-5 w-5" />
                  Usage Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SubscriptionConsumptionChart data={filteredData} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="px-4 lg:px-6">
            <LoadingState message="Loading subscription consumption data..." />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="px-4 lg:px-6">
            <ErrorState message="Failed to load subscription consumption data" />
          </div>
        )}

        {/* Data Table */}
        <div className="px-4 lg:px-6">
          {filteredData.length > 0 && !isLoading ? (
            <Card>
              <CardHeader>
                <CardTitle>Subscription Consumption Report</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={filteredData} />
              </CardContent>
            </Card>
          ) : !isLoading && searchQuery ? (
            <EmptyState
              icon={<IconChartBar className="text-muted-foreground h-10 w-10" />}
              title="No Results Found"
              description="No subscription data matches your search criteria"
            />
          ) : !isLoading ? (
            <EmptyState
              icon={<IconChartBar className="text-muted-foreground h-10 w-10" />}
              title="No Rows To Show"
              description="No subscription consumption data available"
            />
          ) : null}
        </div>
      </div>
    </Container>
  )
}