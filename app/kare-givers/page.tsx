/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Container from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import {
  IconPlus,
  IconMail,
  IconPhone,
  IconCalendar,
  IconUser,

} from "@tabler/icons-react"
import { DataTable, ColumnDef } from "@/components/data-table"
import { ViewToggle } from "@/components/view-toggle"
import { PageHeader } from "@/components/page-header"
import { SearchBar } from "@/components/search-bar"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { EmptyState } from "@/components/empty-state"
import { DeleteDialog } from "@/components/delete-dialog"
import { FilterSection } from "@/components/filter-section"
import { ProfileCard } from "@/components/profile-card"
import { ActionButtons } from "@/components/action-buttons"
import { useKareGivers } from "@/lib/hooks/useKareGivers"
import { Module } from "@/lib/utils/permissions"
import { usePermissions, PermissionGuard } from "@/components/auth/PermissionGuard"
import { toast } from "sonner"

export default function KareGiversPage() {
  return (
    <PermissionGuard module={Module.KARE_GIVERS}>
      <KareGiversPageContent />
    </PermissionGuard>
  )
}

function KareGiversPageContent() {
  const router = useRouter()
  const { data: givers = [], isLoading, error, deleteKareGiver } = useKareGivers()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedGiver, setSelectedGiver] = useState<number | null>(null)
  const [view, setView] = useState<"card" | "table">("card")
  const { canCreate } = usePermissions(Module.KARE_GIVERS)

  const filteredGivers = givers.filter((giver: any) => {
    const query = searchQuery.toLowerCase()
    return (
      (giver.name && giver.name.toLowerCase().includes(query)) ||
      (giver.email && giver.email.toLowerCase().includes(query)) ||
      (giver.mobile && giver.mobile.includes(query)) ||
      (giver.subscriber && giver.subscriber.toLowerCase().includes(query))
    )
  })

  const handleDelete = (id: string) => {
    setSelectedGiver(parseInt(id))
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedGiver) {
      try {
        await deleteKareGiver.mutateAsync(selectedGiver)
        toast.success("Kare Giver deleted successfully")
        setDeleteDialogOpen(false)
        setSelectedGiver(null)
      } catch (error) {
        toast.error("Failed to delete Kare Giver")
        console.error("Failed to delete giver:", error)
      }
    }
  }

  if (error) {
    return (
      <Container>
        <ErrorState message="Error loading Kare Givers" />
      </Container>
    )
  }

  const columns: ColumnDef<any>[] = [
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
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
    },
    {
      accessorKey: "subscriber",
      header: "Subscriber",
    },
    {
      accessorKey: "recipient",
      header: "Recipient",
      cell: (row) => row.recipient || 'N/A',
    },
    {
      accessorKey: "createdDate",
      header: "Created Date",
      cell: (row) => new Date(row.createdDate).toLocaleDateString(),
    },
    {
      header: "Actions",
      cell: (row) => (
        <ActionButtons
          module={Module.KARE_GIVERS}
          onEdit={() => router.push(`/kare-givers/edit/${row.id}`)}
          onDelete={() => handleDelete(row.id)}
          layout="horizontal"
        />
      ),
    },
  ]

  return (
    <Container>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <FilterSection>
          <PageHeader
            title="Kare Givers"
            description="Manage caregiver profiles and information"
            actions={
              <>
                <ViewToggle view={view} onViewChange={setView} />
                {canCreate && (
                  <Button
                    onClick={() => router.push("/kare-givers/add")}
                    className="gap-2"
                  >
                    <IconPlus className="h-4 w-4" />
                    Add New
                  </Button>
                )}
              </>
            }
          />
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, email, mobile, or subscriber..."
          />
        </FilterSection>

        {/* Table View */}
        {view === "table" && (
          <div className="px-4 lg:px-6">
            {isLoading ? (
              <LoadingState message="Loading Kare Givers..." />
            ) : (
              <DataTable
                columns={columns}
                data={filteredGivers}
                onRowClick={(row) => router.push(`/kare-givers/edit/${row.id}`)}
              />
            )}
          </div>
        )}

        {/* Card View */}
        {view === "card" && (
          <>
            {isLoading ? (
              <LoadingState message="Loading Kare Givers..." />
            ) : (
              <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
                {filteredGivers.map((giver: any) => (
                  <ProfileCard
                    key={giver.id}
                    icon={<IconUser className="text-primary h-8 w-8" />}
                    title={giver.name}
                    subtitle={
                      <div className="flex items-center gap-1">
                        <IconUser className="h-4 w-4" />
                        <span className="truncate">
                          {giver.subscriber || 'N/A'}
                        </span>
                      </div>
                    }
                    contactInfo={[
                      {
                        icon: <IconMail className="h-4 w-4" />,
                        label: giver.email || 'N/A',
                      },
                      {
                        icon: <IconPhone className="h-4 w-4" />,
                        label: giver.mobile || 'N/A',
                      },
                      {
                        icon: <IconUser className="h-4 w-4" />,
                        label: `Recipient: ${giver.recipient || 'N/A'}`,
                      },
                      {
                        icon: <IconCalendar className="h-4 w-4" />,
                        label: `Created: ${new Date(giver.createdDate).toLocaleDateString()}`,
                      },
                    ]}
                    actions={
                      <ActionButtons
                        module={Module.KARE_GIVERS}
                        onEdit={() => router.push(`/kare-givers/edit/${giver.id}`)}
                        onDelete={() => handleDelete(giver.id)}
                      />
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && filteredGivers.length === 0 && view === "card" && (
          <EmptyState
            icon={<IconUser className="text-muted-foreground h-10 w-10" />}
            title="No givers found"
            description={
              searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding a new caregiver"
            }
            action={
              !searchQuery && canCreate
                ? {
                    label: "Add New Giver",
                    onClick: () => router.push("/kare-givers/add"),
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
        title="Delete Caregiver"
        description="Are you sure you want to delete this caregiver? This action cannot be undone."
        isDeleting={deleteKareGiver.isPending}
      />
    </Container>
  )
}
