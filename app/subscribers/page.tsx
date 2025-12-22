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
  IconUsers,
  IconCalendar,
  IconBuilding,
  IconMail,
  IconPhone,
  IconWorld,
  IconSearch,
  IconMapPin,
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
import { useSubscribers, SUBSCRIBER_TYPES, PRICE_PLANS } from "@/lib/hooks/useSubscribers"
import { toast } from "sonner"

interface Subscriber {
  id: number
  subscriberType: string
  organizationName: string
  organizationNumber: string
  primaryContactFirstName: string
  primaryContactMiddleName: string
  primaryContactLastName: string
  primaryContactMobile: string
  primaryEmail: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zipcode: string
  country: string
  websiteUrl: string
  pricePlan: string
  createOrgAdmin: boolean
  notes: string
  createdDate: string
  isActive: boolean
}

export default function SubscribersPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined)
  const { data: subscribers = [], isLoading, deleteSubscriber } = useSubscribers(selectedType)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSubscriber, setSelectedSubscriber] = useState<number | null>(null)
  const [view, setView] = useState<"card" | "table">("card")

  const filteredSubscribers = (subscribers as Subscriber[]).filter((subscriber) => {
    const query = searchQuery.toLowerCase()
    return (
      (subscriber.organizationName && subscriber.organizationName.toLowerCase().includes(query)) ||
      (subscriber.primaryEmail && subscriber.primaryEmail.toLowerCase().includes(query)) ||
      (subscriber.primaryContactFirstName && subscriber.primaryContactFirstName.toLowerCase().includes(query)) ||
      (subscriber.primaryContactLastName && subscriber.primaryContactLastName.toLowerCase().includes(query)) ||
      (subscriber.organizationNumber && subscriber.organizationNumber.toLowerCase().includes(query))
    )
  })

  const handleDelete = (id: string) => {
    setSelectedSubscriber(parseInt(id))
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedSubscriber) {
      try {
        await deleteSubscriber.mutateAsync(selectedSubscriber)
        toast.success("Subscriber deleted successfully")
        setDeleteDialogOpen(false)
        setSelectedSubscriber(null)
      } catch (error) {
        toast.error("Failed to delete Subscriber")
        console.error("Failed to delete subscriber:", error)
      }
    }
  }

  const handleClear = () => {
    setSelectedType(undefined)
    setSearchQuery("")
  }

  const getTypeName = (type: string) => {
    return SUBSCRIBER_TYPES.find(t => t.id === type)?.name || "Unknown"
  }

  const getPricePlanName = (planId: string) => {
    return PRICE_PLANS.find(p => p.id === planId)?.name || planId
  }

  const getFullName = (subscriber: Subscriber) => {
    const parts = [
      subscriber.primaryContactFirstName,
      subscriber.primaryContactMiddleName,
      subscriber.primaryContactLastName
    ].filter(Boolean)
    return parts.join(" ")
  }

  const columns: ColumnDef<Subscriber>[] = [
    {
      accessorKey: "organizationName",
      header: "Name",
      cell: (row) => (
        <div className="font-medium">
          {row.organizationName}
        </div>
      ),
    },
    {
      accessorKey: "organizationNumber",
      header: "Org Phone",
      cell: (row) => row.organizationNumber || 'N/A',
    },
    {
      accessorKey: "primaryContactMobile",
      header: "Mobile",
    },
    {
      accessorKey: "primaryEmail",
      header: "Email",
    },
    {
      accessorKey: "subscriberType",
      header: "Type",
      cell: (row) => (
        <Badge variant="outline">
          {getTypeName(row.subscriberType)}
        </Badge>
      ),
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
              router.push(`/subscribers/edit/${row.id}`)
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
            title="Subscriber List"
            description="Manage subscriber organizations and accounts"
            actions={
              <>
                <ViewToggle view={view} onViewChange={setView} />
                <Button
                  onClick={() => router.push("/subscribers/add")}
                  className="gap-2"
                >
                  <IconPlus className="h-4 w-4" />
                  Register New
                </Button>
              </>
            }
          />
          
          {/* Filter Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium whitespace-nowrap">Subscriber Type</label>
                <Select
                  value={selectedType}
                  onValueChange={(value) => setSelectedType(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBSCRIBER_TYPES.map((type) => (
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
            placeholder="Search by organization name, email, contact name, or org number..."
          />
        </FilterSection>

        {/* Table View */}
        {view === "table" && (
          <div className="px-4 lg:px-6">
            <DataTable
              columns={columns}
              data={filteredSubscribers}
              onRowClick={(row) => router.push(`/subscribers/edit/${row.id}`)}
            />
          </div>
        )}

        {/* Card View */}
        {view === "card" && (
          <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            {filteredSubscribers.map((subscriber) => (
              <ProfileCard
                key={subscriber.id}
                icon={
                  subscriber.subscriberType === 'organization' ? 
                    <IconBuilding className="text-primary h-8 w-8" /> :
                    <IconUsers className="text-primary h-8 w-8" />
                }
                title={subscriber.organizationName}
                subtitle={
                  <div className="flex items-center gap-1">
                    <IconUsers className="h-4 w-4" />
                    <span>{getFullName(subscriber)}</span>
                  </div>
                }
                badge={{
                  label: getTypeName(subscriber.subscriberType),
                  variant: subscriber.subscriberType === 'organization' ? "default" : "secondary",
                }}
                contactInfo={[
                  {
                    icon: <IconMail className="h-4 w-4" />,
                    label: subscriber.primaryEmail,
                  },
                  {
                    icon: <IconPhone className="h-4 w-4" />,
                    label: subscriber.primaryContactMobile,
                  },
                  {
                    icon: <IconMapPin className="h-4 w-4" />,
                    label: `${subscriber.city}, ${subscriber.state}`,
                  },
                  ...(subscriber.websiteUrl ? [{
                    icon: <IconWorld className="h-4 w-4" />,
                    label: subscriber.websiteUrl,
                  }] : []),
                  {
                    icon: <IconCalendar className="h-4 w-4" />,
                    label: `Created: ${new Date(subscriber.createdDate).toLocaleDateString()}`,
                  },
                ]}
                actions={
                  <ActionButtons
                    onEdit={() => router.push(`/subscribers/edit/${subscriber.id}`)}
                    onDelete={() => handleDelete(subscriber.id.toString())}
                  />
                }
              />
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingState message="Loading Subscribers..." />}

        {/* Empty State */}
        {!isLoading && filteredSubscribers.length === 0 && view === "card" && (
          <EmptyState
            icon={<IconUsers className="text-muted-foreground h-10 w-10" />}
            title="No subscribers found"
            description={
              searchQuery || selectedType
                ? "Try adjusting your search query or filter"
                : "Get started by registering a new subscriber"
            }
            action={
              !searchQuery && !selectedType
                ? {
                    label: "Register New Subscriber",
                    onClick: () => router.push("/subscribers/add"),
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
        title="Delete Subscriber"
        description="Are you sure you want to delete this subscriber? This action cannot be undone and will affect all associated data."
        isDeleting={deleteSubscriber.isPending}
      />
    </Container>
  )
}
