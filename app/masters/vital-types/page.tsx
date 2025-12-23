"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Container from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconActivity,
  IconCalendar,
  IconUser,
} from "@tabler/icons-react"
import { DataTable, ColumnDef } from "@/components/data-table"
import { ViewToggle } from "@/components/view-toggle"
import { PageHeader } from "@/components/page-header"
import { SearchBar } from "@/components/search-bar"
import { LoadingState } from "@/components/loading-state"
import { EmptyState } from "@/components/empty-state"
import { DeleteDialog } from "@/components/delete-dialog"
import { FilterSection } from "@/components/filter-section"
import { ProfileCard } from "@/components/profile-card"
import { ActionButtons } from "@/components/action-buttons"
import { useVitalTypes } from "@/lib/hooks/useVitalTypes"
import { VitalTypeEntity } from "@/lib/api/types"
import { toast } from "sonner"

export default function VitalTypesPage() {
  const router = useRouter()
  const { data: vitalTypes = [], isLoading, deleteVitalType } = useVitalTypes()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedVitalType, setSelectedVitalType] = useState<number | null>(null)
  const [view, setView] = useState<"card" | "table">("card")

  const filteredVitalTypes = (vitalTypes as VitalTypeEntity[]).filter((vitalType) => {
    const query = searchQuery.toLowerCase()
    return (
      (vitalType.name && vitalType.name.toLowerCase().includes(query)) ||
      (vitalType.providerName && vitalType.providerName.toLowerCase().includes(query))
    )
  })

  const handleDelete = (id: string) => {
    setSelectedVitalType(parseInt(id))
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedVitalType) {
      try {
        await deleteVitalType.mutateAsync(selectedVitalType)
        toast.success("Vital Type deleted successfully")
        setDeleteDialogOpen(false)
        setSelectedVitalType(null)
      } catch (error) {
        toast.error("Failed to delete Vital Type")
        console.error("Failed to delete vital type:", error)
      }
    }
  }

  const columns: ColumnDef<VitalTypeEntity>[] = [
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
      accessorKey: "providerName",
      header: "Provider Name",
    },
    {
      accessorKey: "isManual",
      header: "Entry Type",
      cell: (row) => (
        <Badge variant={row.isManual ? "default" : "secondary"}>
          {row.isManual ? 'Manual' : 'Automatic'}
        </Badge>
      ),
    },
    {
      accessorKey: "createdDate",
      header: "Created Date",
      cell: (row) => new Date(row.createdDate).toLocaleDateString(),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/masters/vital-types/edit/${row.id}`)
            }}
          >
            <IconEdit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(row.id.toString())
            }}
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <Container>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <FilterSection>
          <PageHeader
            title="Vital Types"
            description="Manage vital sign types and their configurations"
            actions={
              <>
                <ViewToggle view={view} onViewChange={setView} />
                <Button
                  onClick={() => router.push("/masters/vital-types/add")}
                  className="gap-2"
                >
                  <IconPlus className="h-4 w-4" />
                  Add New
                </Button>
              </>
            }
          />
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name or provider..."
          />
        </FilterSection>

        {/* Table View */}
        {view === "table" && (
          <div className="px-4 lg:px-6">
            <DataTable
              columns={columns}
              data={filteredVitalTypes}
              onRowClick={(row) => router.push(`/masters/vital-types/edit/${row.id}`)}
            />
          </div>
        )}

        {/* Card View */}
        {view === "card" && (
          <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            {filteredVitalTypes.map((vitalType) => (
              <ProfileCard
                key={vitalType.id}
                icon={<IconActivity className="text-primary h-8 w-8" />}
                title={vitalType.name}
                subtitle={
                  <div className="flex items-center gap-1">
                    <IconUser className="h-4 w-4" />
                    <span>{vitalType.providerName}</span>
                  </div>
                }
                badge={{
                  label: vitalType.isManual ? 'Manual Entry' : 'Automatic',
                  variant: vitalType.isManual ? "default" : "secondary",
                }}
                contactInfo={[
                  {
                    icon: <IconUser className="h-4 w-4" />,
                    label: `Provider: ${vitalType.providerName}`,
                  },
                  {
                    icon: <IconCalendar className="h-4 w-4" />,
                    label: `Created: ${new Date(vitalType.createdDate).toLocaleDateString()}`,
                  },
                ]}
                actions={
                  <ActionButtons
                    onEdit={() => router.push(`/masters/vital-types/edit/${vitalType.id}`)}
                    onDelete={() => handleDelete(vitalType.id.toString())}
                  />
                }
              />
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingState message="Loading Vital Types..." />}

        {/* Empty State */}
        {!isLoading && filteredVitalTypes.length === 0 && view === "card" && (
          <EmptyState
            icon={<IconActivity className="text-muted-foreground h-10 w-10" />}
            title="No vital types found"
            description={
              searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding a new vital type"
            }
            action={
              !searchQuery
                ? {
                    label: "Add New Vital Type",
                    onClick: () => router.push("/masters/vital-types/add"),
                  }
                : undefined
            }
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Vital Type"
        description="Are you sure you want to delete this vital type? This action cannot be undone."
        isDeleting={deleteVitalType.isPending}
      />
    </Container>
  )
}