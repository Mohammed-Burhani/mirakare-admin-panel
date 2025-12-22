"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Container from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconDatabase,
  IconCalendar,
  IconTag,
  IconSearch,
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
import { useMasterValues, MASTER_VALUE_TYPES } from "@/lib/hooks/useMasterValues"
import { toast } from "sonner"

interface MasterValue {
  id: number
  text: string
  description: string | null
  type: number
  isPublished: boolean
  createdDate: string
}

export default function MasterValuesPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<number | undefined>(undefined)
  const { data: masterValues = [], isLoading, deleteMasterValue } = useMasterValues(selectedType)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMasterValue, setSelectedMasterValue] = useState<number | null>(null)
  const [view, setView] = useState<"card" | "table">("card")

  const filteredMasterValues = (masterValues as MasterValue[]).filter((masterValue) => {
    const query = searchQuery.toLowerCase()
    return (
      (masterValue.text && masterValue.text.toLowerCase().includes(query)) ||
      (masterValue.description && masterValue.description.toLowerCase().includes(query))
    )
  })

  const handleDelete = (id: string) => {
    setSelectedMasterValue(parseInt(id))
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedMasterValue) {
      try {
        await deleteMasterValue.mutateAsync(selectedMasterValue)
        toast.success("Master Value deleted successfully")
        setDeleteDialogOpen(false)
        setSelectedMasterValue(null)
      } catch (error) {
        toast.error("Failed to delete Master Value")
        console.error("Failed to delete master value:", error)
      }
    }
  }

  const handleClear = () => {
    setSelectedType(undefined)
    setSearchQuery("")
  }

  const getTypeName = (typeId: number) => {
    return MASTER_VALUE_TYPES.find(t => t.id === typeId)?.name || "Unknown"
  }

  const columns: ColumnDef<MasterValue>[] = [
    {
      accessorKey: "text",
      header: "Text",
      cell: (row) => (
        <div className="font-medium">
          {row.text}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (row) => row.description || 'N/A',
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: (row) => (
        <Badge variant="outline">
          {getTypeName(row.type)}
        </Badge>
      ),
    },
    {
      accessorKey: "isPublished",
      header: "Is Active",
      cell: (row) => (
        <Badge variant={row.isPublished ? "default" : "secondary"}>
          {row.isPublished ? 'Active' : 'Inactive'}
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
              router.push(`/masters/master-values/edit/${row.id}`)
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
            title="Master Values"
            description="Manage master data values and configurations"
            actions={
              <>
                <ViewToggle view={view} onViewChange={setView} />
                <Button
                  onClick={() => router.push("/masters/master-values/add")}
                  className="gap-2"
                >
                  <IconPlus className="h-4 w-4" />
                  Add New
                </Button>
              </>
            }
          />
          
          {/* Filter Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium whitespace-nowrap">Master value type</label>
                <Select
                  value={selectedType?.toString()}
                  onValueChange={(value) => setSelectedType(value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {MASTER_VALUE_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    // Trigger search/filter - data will automatically update via the hook
                  }}
                >
                  <IconSearch className="h-4 w-4" />
                  Search
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by text or description..."
          />
        </FilterSection>

        {/* Table View */}
        {view === "table" && (
          <div className="px-4 lg:px-6">
            <DataTable
              columns={columns}
              data={filteredMasterValues}
              onRowClick={(row) => router.push(`/masters/master-values/edit/${row.id}`)}
            />
          </div>
        )}

        {/* Card View */}
        {view === "card" && (
          <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            {filteredMasterValues.map((masterValue) => (
              <ProfileCard
                key={masterValue.id}
                icon={<IconDatabase className="text-primary h-8 w-8" />}
                title={masterValue.text}
                subtitle={
                  <div className="flex items-center gap-1">
                    <IconTag className="h-4 w-4" />
                    <span>{getTypeName(masterValue.type)}</span>
                  </div>
                }
                badge={{
                  label: masterValue.isPublished ? 'Active' : 'Inactive',
                  variant: masterValue.isPublished ? "default" : "secondary",
                }}
                contactInfo={[
                  {
                    icon: <IconTag className="h-4 w-4" />,
                    label: `Type: ${getTypeName(masterValue.type)}`,
                  },
                  {
                    icon: <IconDatabase className="h-4 w-4" />,
                    label: `Description: ${masterValue.description || 'N/A'}`,
                  },
                  {
                    icon: <IconCalendar className="h-4 w-4" />,
                    label: `Created: ${new Date(masterValue.createdDate).toLocaleDateString()}`,
                  },
                ]}
                actions={
                  <ActionButtons
                    onEdit={() => router.push(`/masters/master-values/edit/${masterValue.id}`)}
                    onDelete={() => handleDelete(masterValue.id.toString())}
                  />
                }
              />
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingState message="Loading Master Values..." />}

        {/* Empty State */}
        {!isLoading && filteredMasterValues.length === 0 && view === "card" && (
          <EmptyState
            icon={<IconDatabase className="text-muted-foreground h-10 w-10" />}
            title="No master values found"
            description={
              searchQuery || selectedType
                ? "Try adjusting your search query or filter"
                : "Get started by adding a new master value"
            }
            action={
              !searchQuery && !selectedType
                ? {
                    label: "Add New Master Value",
                    onClick: () => router.push("/masters/master-values/add"),
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
        title="Delete Master Value"
        description="Are you sure you want to delete this master value? This action cannot be undone."
        isDeleting={deleteMasterValue.isPending}
      />
    </Container>
  )
}