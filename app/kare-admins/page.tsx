"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Container from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconPlus,
  IconShieldCheck,
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
import { EmptyState } from "@/components/empty-state"
import { DeleteDialog } from "@/components/delete-dialog"
import { FilterSection } from "@/components/filter-section"
import { ProfileCard } from "@/components/profile-card"
import { ActionButtons } from "@/components/action-buttons"
import { useKareAdmins } from "@/lib/hooks/useKareAdmins"
import { KareAdmin } from "@/lib/api/types"
import { Module } from "@/lib/utils/permissions"
import { usePermissions, PermissionGuard } from "@/components/auth/PermissionGuard"
import { toast } from "sonner"

export default function KareAdminsPage() {
  return (
    <PermissionGuard module={Module.KARE_ADMINS}>
      <KareAdminsPageContent />
    </PermissionGuard>
  )
}

function KareAdminsPageContent() {
  const router = useRouter()
  const { data: admins = [], isLoading, deleteKareAdmin } = useKareAdmins()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<number | null>(null)
  const [view, setView] = useState<"card" | "table">("card")
  const { canCreate } = usePermissions(Module.KARE_ADMINS)

  const filteredAdmins = admins.filter((admin: KareAdmin) => {
    const query = searchQuery.toLowerCase()
    return (
      (admin.name && admin.name.toLowerCase().includes(query)) ||
      (admin.email && admin.email.toLowerCase().includes(query)) ||
      (admin.mobile && admin.mobile.includes(query)) ||
      (admin.subscriber && admin.subscriber.toLowerCase().includes(query))
    )
  })

  const handleDelete = (id: string) => {
    setSelectedAdmin(parseInt(id))
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedAdmin) {
      try {
        await deleteKareAdmin.mutateAsync(selectedAdmin)
        toast.success("Kare Admin deleted successfully")
        setDeleteDialogOpen(false)
        setSelectedAdmin(null)
      } catch (error) {
        toast.error("Failed to delete Kare Admin")
        console.error("Failed to delete admin:", error)
      }
    }
  }

  const columns: ColumnDef<KareAdmin>[] = [
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
      accessorKey: "recipientId",
      header: "Recipient ID",
    },
    {
      accessorKey: "additionalRole",
      header: "Additional Role",
      cell: (row) => {
        const role = row.additionalRole && typeof row.additionalRole === 'string' ? row.additionalRole : "None"
        return (
          <Badge variant={row.additionalRole ? "default" : "secondary"}>
            {role}
          </Badge>
        )
      },
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
          module={Module.KARE_ADMINS}
          onEdit={() => router.push(`/kare-admins/edit/${row.id}`)}
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
            title="Kare Admins"
            description="Manage administrator accounts and permissions"
            actions={
              <>
                <ViewToggle view={view} onViewChange={setView} />
                {canCreate && (
                  <Button
                    onClick={() => router.push("/kare-admins/add")}
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
            <DataTable
              columns={columns}
              data={filteredAdmins}
              onRowClick={(row) => router.push(`/kare-admins/edit/${row.id}`)}
            />
          </div>
        )}

        {/* Card View */}
        {view === "card" && (
          <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            {filteredAdmins.map((admin) => (
              <ProfileCard
                key={admin.id}
                icon={<IconShieldCheck className="text-primary h-8 w-8" />}
                title={admin.name}
                subtitle={
                  <div className="flex items-center gap-1">
                    <IconUser className="h-4 w-4" />
                    <span>Subscriber: {admin.subscriber}</span>
                  </div>
                }
                badge={{
                  label: admin.additionalRole ? `Role: ${admin.additionalRole}` : 'Admin',
                  variant: admin.additionalRole ? "default" : "secondary",
                }}
                contactInfo={[
                  {
                    icon: <IconMail className="h-4 w-4" />,
                    label: admin.email,
                  },
                  {
                    icon: <IconPhone className="h-4 w-4" />,
                    label: admin.mobile,
                  },
                  {
                    icon: <IconUser className="h-4 w-4" />,
                    label: `Recipient ID: ${admin.recipientId}`,
                  },
                  {
                    icon: <IconCalendar className="h-4 w-4" />,
                    label: `Created: ${new Date(admin.createdDate).toLocaleDateString()}`,
                  },
                ]}
                actions={
                  <ActionButtons
                    module={Module.KARE_ADMINS}
                    onEdit={() => router.push(`/kare-admins/edit/${admin.id}`)}
                    onDelete={() => handleDelete(admin.id.toString())}
                  />
                }
              />
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingState message="Loading Kare Admins..." />}

        {/* Empty State */}
        {!isLoading && filteredAdmins.length === 0 && view === "card" && (
          <EmptyState
            icon={<IconShieldCheck className="text-muted-foreground h-10 w-10" />}
            title="No admins found"
            description={
              searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding a new admin"
            }
            action={
              !searchQuery && canCreate
                ? {
                    label: "Add New Admin",
                    onClick: () => router.push("/kare-admins/add"),
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
        title="Delete Admin"
        description="Are you sure you want to delete this admin? This action cannot be undone."
        isDeleting={deleteKareAdmin.isPending}
      />
    </Container>
  )
}
