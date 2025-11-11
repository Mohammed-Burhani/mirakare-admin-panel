"use client"

import { useState } from "react"
import Container from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable, ColumnDef } from "@/components/data-table"
import { IconFileSpreadsheet } from "@tabler/icons-react"

// Mock data for different vital types
const mockTemperatureData = [
  {
    id: 1,
    user_id: "141a0d97-a3bd-...",
    calendar_date: "11/01/2025",
    date: "11/01/2025 09:24:00",
    fat: "",
    weight: "",
    height: "",
    temperature: "97",
    source: "Manual",
  },
  {
    id: 2,
    user_id: "141a0d97-a3bd-...",
    calendar_date: "11/01/2025",
    date: "11/01/2025 09:24:00",
    fat: "",
    weight: "",
    height: "",
    temperature: "97",
    source: "Manual",
  },
]

const mockBloodPressureData = [
  {
    id: 62,
    user_id: "141a0d97-a3bd-...",
    timestamp: "10/11/2024 01:00:00",
    timezone_offset: "-14400",
    type: "",
    unit: "mmHg",
    diastolic: "80",
    systolic: "110",
    source: "Manual",
  },
  {
    id: 63,
    user_id: "141a0d97-a3bd-...",
    timestamp: "10/12/2024 10:01:00",
    timezone_offset: "-14400",
    type: "",
    unit: "mmHg",
    diastolic: "76",
    systolic: "118",
    source: "Manual",
  },
]

const mockHeartRateData = [
  {
    id: 1,
    user_id: "141a0d97-a3bd-...",
    timestamp: "11/01/2025 09:24:00",
    heart_rate: "72",
    unit: "bpm",
    source: "Manual",
  },
  {
    id: 2,
    user_id: "141a0d97-a3bd-...",
    timestamp: "11/02/2025 10:15:00",
    heart_rate: "68",
    unit: "bpm",
    source: "Device",
  },
]

const mockGlucoseData = [
  {
    id: 1,
    user_id: "141a0d97-a3bd-...",
    timestamp: "11/01/2025 08:00:00",
    glucose_level: "95",
    unit: "mg/dL",
    meal_context: "Fasting",
    source: "Manual",
  },
  {
    id: 2,
    user_id: "141a0d97-a3bd-...",
    timestamp: "11/01/2025 14:30:00",
    glucose_level: "120",
    unit: "mg/dL",
    meal_context: "After Meal",
    source: "Manual",
  },
]

const mockWeightData = [
  {
    id: 1,
    user_id: "141a0d97-a3bd-...",
    date: "11/01/2025 09:00:00",
    weight: "165",
    unit: "lbs",
    bmi: "24.5",
    source: "Manual",
  },
  {
    id: 2,
    user_id: "141a0d97-a3bd-...",
    date: "11/08/2025 09:00:00",
    weight: "163",
    unit: "lbs",
    bmi: "24.2",
    source: "Device",
  },
]

const vitalTypes = [
  "Blood Pressure",
  "Breathing Rate",
  "Glucose",
  "Heart Rate",
  "Oxygen Level",
  "Sleep",
  "Temperature",
  "Weight",
]

const mockRecipients = ["Mira Sharma", "John Doe", "Jane Smith"]

export default function ReportsPage() {
  const [selectedVital, setSelectedVital] = useState<string>("")
  const [selectedRecipient, setSelectedRecipient] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [tableData, setTableData] = useState<
    Array<Record<string, string | number> & { id: string | number }>
  >([])

  const handleSearch = () => {
    if (!selectedVital) {
      alert("Please select a vital type")
      return
    }
    
    // Load data based on selected vital type
    switch (selectedVital) {
      case "Temperature":
        setTableData(mockTemperatureData)
        break
      case "Blood Pressure":
        setTableData(mockBloodPressureData)
        break
      case "Heart Rate":
        setTableData(mockHeartRateData)
        break
      case "Glucose":
        setTableData(mockGlucoseData)
        break
      case "Weight":
        setTableData(mockWeightData)
        break
      default:
        setTableData([])
    }
  }

  const handleClear = () => {
    setSelectedVital("")
    setSelectedRecipient("")
    setStartDate("")
    setEndDate("")
    setTableData([])
  }

  const handleExport = () => {
    console.log("Exporting data to Excel...")
    // Export logic here
  }

  // Dynamic columns based on vital type
  const getColumns = (): ColumnDef<
    Record<string, string | number> & { id: string | number }
  >[] => {
    switch (selectedVital) {
      case "Temperature":
        return [
          { accessorKey: "user_id", header: "User ID" },
          { accessorKey: "calendar_date", header: "Calendar Date" },
          { accessorKey: "date", header: "Date" },
          { accessorKey: "fat", header: "Fat" },
          { accessorKey: "weight", header: "Weight" },
          { accessorKey: "height", header: "Height" },
          { accessorKey: "temperature", header: "Temperature" },
          { accessorKey: "source", header: "Source" },
        ]
      case "Blood Pressure":
        return [
          { accessorKey: "id", header: "ID" },
          { accessorKey: "user_id", header: "User ID" },
          { accessorKey: "timestamp", header: "Timestamp" },
          { accessorKey: "timezone_offset", header: "Timezone Offset" },
          { accessorKey: "type", header: "Type" },
          { accessorKey: "unit", header: "Unit" },
          { accessorKey: "diastolic", header: "Diastolic" },
          { accessorKey: "systolic", header: "Systolic" },
          { accessorKey: "source", header: "Source" },
        ]
      case "Heart Rate":
        return [
          { accessorKey: "id", header: "ID" },
          { accessorKey: "user_id", header: "User ID" },
          { accessorKey: "timestamp", header: "Timestamp" },
          { accessorKey: "heart_rate", header: "Heart Rate" },
          { accessorKey: "unit", header: "Unit" },
          { accessorKey: "source", header: "Source" },
        ]
      case "Glucose":
        return [
          { accessorKey: "id", header: "ID" },
          { accessorKey: "user_id", header: "User ID" },
          { accessorKey: "timestamp", header: "Timestamp" },
          { accessorKey: "glucose_level", header: "Glucose Level" },
          { accessorKey: "unit", header: "Unit" },
          { accessorKey: "meal_context", header: "Meal Context" },
          { accessorKey: "source", header: "Source" },
        ]
      case "Weight":
        return [
          { accessorKey: "id", header: "ID" },
          { accessorKey: "user_id", header: "User ID" },
          { accessorKey: "date", header: "Date" },
          { accessorKey: "weight", header: "Weight" },
          { accessorKey: "unit", header: "Unit" },
          { accessorKey: "bmi", header: "BMI" },
          { accessorKey: "source", header: "Source" },
        ]
      default:
        return []
    }
  }

  return (
    <Container>
      <div className="flex flex-col gap-6 py-6">
        {/* Page Title */}
        <div className="px-4 lg:px-6">
          <h1 className="text-2xl font-semibold">Vital Stats</h1>
        </div>

        {/* Filters Section */}
        <div className="space-y-4 px-4 lg:px-6">
          {/* Row 1: Vital and Recipient */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vital" className="text-sm">
                Vital
              </Label>
              <Select value={selectedVital} onValueChange={setSelectedVital}>
                <SelectTrigger id="vital" className="w-full">
                  <SelectValue placeholder="Select Vital Type" />
                </SelectTrigger>
                <SelectContent>
                  {vitalTypes.map((vital) => (
                    <SelectItem key={vital} value={vital}>
                      {vital}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-sm">
                Kare Recipient
              </Label>
              <Select
                value={selectedRecipient}
                onValueChange={setSelectedRecipient}
              >
                <SelectTrigger id="recipient" className="w-full">
                  <SelectValue placeholder="Select Recipient" />
                </SelectTrigger>
                <SelectContent>
                  {mockRecipients.map((recipient) => (
                    <SelectItem key={recipient} value={recipient}>
                      {recipient}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Date Range and Actions */}
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-end">
            <div className="w-full space-y-2 md:w-auto">
              <Label htmlFor="startDate" className="text-sm">
                Date Range
              </Label>
              <div className="flex items-center gap-3">
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="dd-mm-yyyy"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:w-[180px]"
                />
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="dd-mm-yyyy"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:w-[180px]"
                />
              </div>
            </div>

            <div className="flex w-full gap-2 md:ml-auto md:w-auto">
              <Button onClick={handleSearch} className="flex-1 md:flex-none">
                Search
              </Button>

              <Button
                variant="outline"
                onClick={handleClear}
                className="flex-1 md:flex-none"
              >
                Clear
              </Button>

              <Button
                variant="default"
                onClick={handleExport}
                className="flex-1 gap-2 bg-green-600 hover:bg-green-700 md:flex-none"
                disabled={tableData.length === 0}
              >
                <IconFileSpreadsheet className="h-4 w-4" />
                Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="px-4 lg:px-6">
          {tableData.length > 0 ? (
            <div className="rounded-lg border bg-card">
              <DataTable columns={getColumns()} data={tableData} />
            </div>
          ) : (
            <div className="border-muted flex h-64 items-center justify-center rounded-lg border bg-card">
              <p className="text-muted-foreground text-sm">
                {selectedVital
                  ? "No data available for the selected filters"
                  : "Select a vital type and click Search to view data"}
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
