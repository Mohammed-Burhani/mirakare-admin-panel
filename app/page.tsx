"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable, ColumnDef } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import data from "./caregivers-data.json"
import Container from "@/components/layout/container"

type CaregiverData = typeof data[0]

const columns: ColumnDef<CaregiverData>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "role", header: "Role" },
  { 
    header: "Details",
    cell: (row) => {
      if (row.role === "Kare Giver") {
        return `${row.specialization} • ${row.patients} patients`
      }
      if (row.role === "Kare Receiver") {
        return `${row.condition} • ${row.caregiver}`
      }
      if (row.role === "Kare Viewer") {
        return `${row.relation} • Monitoring: ${row.monitoring}`
      }
      if (row.role === "Kare Admin") {
        return `${row.department} • ${row.employeeId}`
      }
      return ""
    }
  },
  { accessorKey: "status", header: "Status" },
]

export default function Home() {
  return (
    <Container>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </Container>
  )
}
