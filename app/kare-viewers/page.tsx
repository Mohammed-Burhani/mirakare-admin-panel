"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Container from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconPlus,
  IconMail,
  IconPhone,
  IconCalendar,
  IconUser,
  IconEye,
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
import { useKareViewers } from "@/lib/hooks/useKareViewers"
import { KareViewer } from "@/lib/api/types"
import { Module } from "@/lib/utils/permissions"
import { usePermissions, PermissionGuard } from "@/components/auth/PermissionGuard"
import { toast } from "sonner"

export default function KareViewersPage() {
  return (
    <PermissionGuard module={Module.KARE_VIEWERS}>
      <KareViewersPageContent />
    </PermissionGuard>
  )
}

function KareViewersPageContent() {
  const router = useRouter()
  const { data: viewers = [], isLoading, error, deleteKareViewer } = useKareViewers()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedViewer, setSelectedViewer] = useState<number | null>(null)
  const [view, setView] = useState<"card" | "table">("card")
  const { canCreate } = usePermissions(Module.KARE_VIEWERS)

  const filteredViewers = viewers.filter((viewer: KareViewer) => {
    const query = searchQuery.toLowerCase()
    const name = `${viewer.fname} ${viewer.lname}`.trim()
    
    return (
      (name && name.toLowerCase().includes(query)) ||
      (viewer.email && viewer.email.toLowerCase().includes(query)) ||
      (viewer.mobile && viewer.mobile.includes(query))
    )
  })

  const handleDelete = (id: string) => {
    setSelectedViewer(parseInt(id))
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedViewer) {
      try {
        await deleteKareViewer.mutateAsync(selectedViewer)
        toast.success("Kare Viewer deleted successfully")
        setDeleteDialogOpen(false)
        setSelectedViewer(null)
      } catch (error) {
        toast.error("Failed to delete Kare Viewer")
        console.error("Failed to delete viewer:", error)
      }
    }
  }

  if (error) {
    return (
      <Container>
        <ErrorState message="Error loading Kare Viewers" />
      </Container>
    )
  }

  const columns: ColumnDef<KareViewer>[] = [
    {
      accessorKey: "fname",
      header: "Name",
      cell: (row) => (
        <div className="font-medium">
          {`${row.fname} ${row.lname}`.trim()}
        </div>
      ),
    },
    {
      accessorKey: "recipientId",
      header: "Recipient ID",
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
      accessorKey: "subscriberId",
      header: "Subscriber ID",
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
          module={Module.KARE_VIEWERS}
          onEdit={() => router.push(`/kare-viewers/edit/${row.id}`)}
          onDelete={() => handleDelete(row.id.toString())}
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
            title="Kare Viewers"
            description="Manage viewer accounts and access permissions"
            actions={
              <>
                <ViewToggle view={view} onViewChange={setView} />
                {canCreate && (
                  <Button
                    onClick={() => router.push("/kare-viewers/add")}
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
            placeholder="Search by name, email, mobile, recipient, or subscriber..."
          />
        </FilterSection>

        {/* Table View */}
        {view === "table" && (
          <div className="px-4 lg:px-6">
            <DataTable
              columns={columns}
              data={filteredViewers}
              onRowClick={(row) => router.push(`/kare-viewers/edit/${row.id}`)}
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingState message="Loading Kare Viewers..." />}

        {/* Card View */}
        {!isLoading && view === "card" && (
          <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            {filteredViewers.map((viewer: KareViewer) => {
              const name = `${viewer.fname} ${viewer.lname}`.trim()
              return (
                <ProfileCard
                  key={viewer.id}
                  icon={<IconEye className="text-primary h-8 w-8" />}
                  title={name}
                  subtitle={
                    <div className="flex items-center gap-1">
                      <IconUser className="h-4 w-4" />
                      <span>Recipient ID: {viewer.recipientId}</span>
                    </div>
                  }
                  badge={{
                    label: `Recipient ID: ${viewer.recipientId}`,
                    variant: "secondary",
                  }}
                  contactInfo={[
                    {
                      icon: <IconMail className="h-4 w-4" />,
                      label: viewer.email || 'N/A',
                    },
                    {
                      icon: <IconPhone className="h-4 w-4" />,
                      label: viewer.mobile || 'N/A',
                    },
                    {
                      icon: <IconUser className="h-4 w-4" />,
                      label: `Subscriber ID: ${viewer.subscriberId}`,
                    },
                    {
                      icon: <IconCalendar className="h-4 w-4" />,
                      label: `Created: ${new Date(viewer.createdDate).toLocaleDateString()}`,
                    },
                  ]}
                  actions={
                    <ActionButtons
                      module={Module.KARE_VIEWERS}
                      onEdit={() => router.push(`/kare-viewers/edit/${viewer.id}`)}
                      onDelete={() => handleDelete(viewer.id.toString())}
                    />
                  }
                />
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredViewers.length === 0 && view === "card" && (
          <EmptyState
            icon={<IconEye className="text-muted-foreground h-10 w-10" />}
            title="No viewers found"
            description={
              searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding a new viewer"
            }
            action={
              !searchQuery && canCreate
                ? {
                    label: "Add New Viewer",
                    onClick: () => router.push("/kare-viewers/add"),
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
        title="Delete Viewer"
        description="Are you sure you want to delete this viewer? This action cannot be undone."
        isDeleting={deleteKareViewer.isPending}
      />
    </Container>
  )
}
