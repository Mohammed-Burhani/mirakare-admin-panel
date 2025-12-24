"use client"

import { useState } from "react"
import Container from "@/components/layout/container"
import { PageHeader } from "@/components/page-header"
import { Module } from "@/lib/utils/permissions"
import { PermissionGuard } from "@/components/auth/PermissionGuard"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable, ColumnDef } from "@/components/data-table"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { EmptyState } from "@/components/empty-state"
import { useVitalTypes } from "@/lib/hooks/useVitalTypes"
import { useKareRecipients } from "@/lib/hooks/useKareRecipients"
import { useVitalStats } from "@/lib/hooks/useVitalStats"
import { VitalStatsData } from "@/lib/api/types"
import { 
  IconFileSpreadsheet, 
  IconTrendingUp, 
  IconCalendar,
  IconActivity,
  IconSearch,
  IconX
} from "@tabler/icons-react"
import { VitalStatsChart } from "@/components/vital-stats-chart"

export default function VitalStatsPage() {
  return (
    <PermissionGuard module={Module.REPORTS}>
      <VitalStatsPageContent />
    </PermissionGuard>
  )
}

function VitalStatsPageContent() {
  // Initialize default date range to last 7 days
  const getDefaultDateRange = () => {
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)
    
    return {
      startDate: sevenDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    }
  }

  const defaultDates = getDefaultDateRange()
  const [selectedVital, setSelectedVital] = useState<string>("")
  const [selectedRecipient, setSelectedRecipient] = useState<string>("")
  const [startDate, setStartDate] = useState<string>(defaultDates.startDate)
  const [endDate, setEndDate] = useState<string>(defaultDates.endDate)

  const { data: vitalTypes = [], isLoading: loadingVitals } = useVitalTypes()
  const { data: recipients = [], isLoading: loadingRecipients } = useKareRecipients()
  
  const { 
    data: vitalStatsData = [], 
    isLoading: loadingStats, 
    error: statsError,
    refetch: refetchStats 
  } = useVitalStats({
    vitalName: selectedVital,
    recipientId: selectedRecipient,
    fromDate: startDate,
    toDate: endDate,
    enabled: !!(selectedVital && startDate && endDate)
  })

  const handleSearch = () => {
    if (!selectedVital) {
      alert("Please select a vital type")
      return
    }
    refetchStats()
  }

  const handleClear = () => {
    setSelectedVital("")
    setSelectedRecipient("")
    // Reset to default 7-day range
    const defaultDates = getDefaultDateRange()
    setEndDate(defaultDates.endDate)
    setStartDate(defaultDates.startDate)
  }

  const handleExport = () => {
    if (vitalStatsData.length === 0) {
      alert("No data to export")
      return
    }

    // Prepare data for export
    const exportData = vitalStatsData.map((item: VitalStatsData) => {
      const timestamp = new Date(item.timestamp)
      return {
        Date: timestamp.toLocaleDateString(),
        Time: timestamp.toLocaleTimeString(),
        'Systolic': item.systolic || 'N/A',
        'Diastolic': item.diastolic || 'N/A',
        'Unit': item.unit || 'N/A',
        'Source': item.source || 'Manual',
        'User ID': item.user_id,
        'Created By': item.createdBy,
        'Timezone Offset': item.timezone_offset
      }
    })

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
    link.setAttribute('download', `vital-stats-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Dynamic columns based on vital type
  const getColumns = (): ColumnDef<VitalStatsData>[] => {
    return [
      {
        accessorKey: "timestamp",
        header: "Date & Time",
        cell: (row) => {
          const timestamp = row.timestamp
          const date = new Date(timestamp)
          return (
            <div className="space-y-1">
              <div className="font-medium">{date.toLocaleDateString()}</div>
              <div className="text-sm text-muted-foreground">{date.toLocaleTimeString()}</div>
            </div>
          )
        },
      },
      {
        accessorKey: "systolic",
        header: "Systolic",
        cell: (row) => `${row.systolic || 'N/A'} ${row.unit || ''}`,
      },
      {
        accessorKey: "diastolic", 
        header: "Diastolic",
        cell: (row) => `${row.diastolic || 'N/A'} ${row.unit || ''}`,
      },
      {
        accessorKey: "source",
        header: "Source",
        cell: (row) => row.source || "Manual",
      },
      {
        accessorKey: "user_id",
        header: "User ID",
        cell: (row) => {
          const userId = row.user_id
          return userId.substring(0, 8) + "..." // Show first 8 characters
        },
      },
    ]
  }

  const isLoading = loadingVitals || loadingRecipients || loadingStats

  return (
    <Container>
      <div className="flex flex-col gap-6 py-4 md:py-6">
        {/* Page Header */}
        <div className="px-4 lg:px-6">
          <PageHeader
            title="Vital Stats"
            description="View and analyze vital signs data with interactive charts and detailed reports"
          />
        </div>

        {/* Filters Section */}
        <Card className="mx-4 lg:mx-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconActivity className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Row 1: Vital and Recipient */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="vital" className="text-sm font-medium">
                  Vital
                </Label>
                <Select value={selectedVital} onValueChange={setSelectedVital} disabled={loadingVitals}>
                  <SelectTrigger id="vital" className="w-full">
                    <SelectValue placeholder="Select Vital Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vitalTypes.map((vital) => (
                      <SelectItem key={vital.id} value={vital.name.toLowerCase().replace(/\s+/g, '')}>
                        {vital.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-sm font-medium">
                  Kare Recipient
                </Label>
                <Select
                  value={selectedRecipient}
                  onValueChange={setSelectedRecipient}
                  disabled={loadingRecipients}
                >
                  <SelectTrigger id="recipient" className="w-full">
                    <SelectValue placeholder="Select a Recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipients.map((recipient) => (
                      <SelectItem key={recipient.id} value={recipient.id.toString()}>
                        {recipient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Date Range and Actions */}
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-end">
              <div className="w-full space-y-2 md:w-auto">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <IconCalendar className="h-4 w-4" />
                  Date Range
                </Label>
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:w-[180px]"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:w-[180px]"
                  />
                </div>
              </div>

              <div className="flex w-full gap-2 md:ml-auto md:w-auto">
                <Button 
                  onClick={handleSearch} 
                  className="flex-1 md:flex-none gap-2"
                  disabled={!selectedVital || isLoading}
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
                  disabled={vitalStatsData.length === 0}
                >
                  <IconFileSpreadsheet className="h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="px-4 lg:px-6">
            <LoadingState message="Loading vital stats data..." />
          </div>
        )}

        {/* Error State */}
        {statsError && !isLoading && (
          <div className="px-4 lg:px-6">
            <ErrorState message="Failed to load vital stats data" />
          </div>
        )}

        {/* Charts Section */}
        {vitalStatsData.length > 0 && !isLoading && (
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconTrendingUp className="h-5 w-5" />
                  Vital Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VitalStatsChart 
                  data={vitalStatsData} 
                  vitalType={selectedVital}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Data Table */}
        <div className="px-4 lg:px-6">
          {vitalStatsData.length > 0 && !isLoading ? (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Data</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={getColumns()} data={vitalStatsData} />
              </CardContent>
            </Card>
          ) : !isLoading && selectedVital ? (
            <EmptyState
              icon={<IconActivity className="text-muted-foreground h-10 w-10" />}
              title="No Rows To Show"
              description="No vital stats data available for the selected filters"
            />
          ) : !isLoading ? (
            <EmptyState
              icon={<IconActivity className="text-muted-foreground h-10 w-10" />}
              title="Select Filters"
              description="Select a vital type and date range to view vital stats data"
            />
          ) : null}
        </div>
      </div>
    </Container>
  )
}