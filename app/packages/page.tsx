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
  IconPackage,
  IconCalendar,
  IconUsers,
  IconEye,
  IconUserHeart,
  IconCurrency,
  IconSearch,
  IconClock,
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
import { usePackages, PACKAGE_TYPES } from "@/lib/hooks/usePackages"
import { toast } from "sonner"

interface Package {
  id: number
  name: string
  type: string
  isActive: boolean
  durationInMonths: number
  noOfKareReceivers: number
  noOfKareGivers: number
  noOfKareViewers: number
  price: number
  description: string
  features: string[]
  createdDate: string
}

export default function PackagesPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined)
  const { data: packages = [], isLoading, deletePackage } = usePackages(selectedType)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [view, setView] = useState<"card" | "table">("card")

  const filteredPackages = (packages as Package[]).filter((pkg) => {
    const query = searchQuery.toLowerCase()
    return (
      (pkg.name && pkg.name.toLowerCase().includes(query)) ||
      (pkg.description && pkg.description.toLowerCase().includes(query)) ||
      (pkg.type && pkg.type.toLowerCase().includes(query))
    )
  })

  const handleDelete = (id: string) => {
    setSelectedPackage(parseInt(id))
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedPackage) {
      try {
        await deletePackage.mutateAsync(selectedPackage)
        toast.success("Package deleted successfully")
        setDeleteDialogOpen(false)
        setSelectedPackage(null)
      } catch (error) {
        toast.error("Failed to delete Package")
        console.error("Failed to delete package:", error)
      }
    }
  }

  const handleClear = () => {
    setSelectedType(undefined)
    setSearchQuery("")
  }

  const getTypeName = (type: string) => {
    return PACKAGE_TYPES.find(t => t.id === type)?.name || "Unknown"
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const columns: ColumnDef<Package>[] = [
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
          {getTypeName(row.type)}
        </Badge>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: (row) => (
        <span className="font-medium text-green-600">
          {formatPrice(row.price)}
        </span>
      ),
    },
    {
      accessorKey: "durationInMonths",
      header: "Duration",
      cell: (row) => `${row.durationInMonths} months`,
    },
    {
      accessorKey: "noOfKareReceivers",
      header: "Receivers",
      cell: (row) => row.noOfKareReceivers,
    },
    {
      accessorKey: "noOfKareGivers",
      header: "Givers",
      cell: (row) => row.noOfKareGivers,
    },
    {
      accessorKey: "noOfKareViewers",
      header: "Viewers",
      cell: (row) => row.noOfKareViewers,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: (row) => (
        <Badge variant={row.isActive ? "default" : "secondary"}>
          {row.isActive ? 'Active' : 'Inactive'}
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
              router.push(`/packages/edit/${row.id}`)
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
            title="Package List"
            description="Manage subscription packages and pricing plans"
            actions={
              <>
                <ViewToggle view={view} onViewChange={setView} />
                <Button
                  onClick={() => router.push("/packages/add")}
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
                <Select
                  value={selectedType}
                  onValueChange={(value) => setSelectedType(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PACKAGE_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
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
            placeholder="Search by package name, description, or type..."
          />
        </FilterSection>

        {/* Table View */}
        {view === "table" && (
          <div className="px-4 lg:px-6">
            <DataTable
              columns={columns}
              data={filteredPackages}
              onRowClick={(row) => router.push(`/packages/edit/${row.id}`)}
            />
          </div>
        )}

        {/* Card View */}
        {view === "card" && (
          <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            {filteredPackages.map((pkg) => (
              <ProfileCard
                key={pkg.id}
                icon={<IconPackage className="text-primary h-8 w-8" />}
                title={pkg.name}
                subtitle={
                  <div className="flex items-center gap-1">
                    <IconCurrency className="h-4 w-4" />
                    <span className="font-semibold text-green-600">{formatPrice(pkg.price)}</span>
                    <span className="text-muted-foreground">/ {pkg.durationInMonths} months</span>
                  </div>
                }
                badge={{
                  label: getTypeName(pkg.type),
                  variant: pkg.type === 'enterprise' ? "default" : "secondary",
                }}
                contactInfo={[
                  {
                    icon: <IconClock className="h-4 w-4" />,
                    label: `Duration: ${pkg.durationInMonths} months`,
                  },
                  {
                    icon: <IconUserHeart className="h-4 w-4" />,
                    label: `Receivers: ${pkg.noOfKareReceivers}`,
                  },
                  {
                    icon: <IconUsers className="h-4 w-4" />,
                    label: `Givers: ${pkg.noOfKareGivers}`,
                  },
                  {
                    icon: <IconEye className="h-4 w-4" />,
                    label: `Viewers: ${pkg.noOfKareViewers}`,
                  },
                  {
                    icon: <IconCalendar className="h-4 w-4" />,
                    label: `Created: ${new Date(pkg.createdDate).toLocaleDateString()}`,
                  },
                ]}
                actions={
                  <ActionButtons
                    onEdit={() => router.push(`/packages/edit/${pkg.id}`)}
                    onDelete={() => handleDelete(pkg.id.toString())}
                  />
                }
              />
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingState message="Loading Packages..." />}

        {/* Empty State */}
        {!isLoading && filteredPackages.length === 0 && view === "card" && (
          <EmptyState
            icon={<IconPackage className="text-muted-foreground h-10 w-10" />}
            title="No packages found"
            description={
              searchQuery || selectedType
                ? "Try adjusting your search query or filter"
                : "Get started by creating a new package"
            }
            action={
              !searchQuery && !selectedType
                ? {
                    label: "Create New Package",
                    onClick: () => router.push("/packages/add"),
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
        title="Delete Package"
        description="Are you sure you want to delete this package? This action cannot be undone and may affect existing subscribers."
        isDeleting={deletePackage.isPending}
      />
    </Container>
  )
}
