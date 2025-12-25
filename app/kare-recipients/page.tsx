"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Container from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconPlus,
  IconHeartbeat,
  IconMail,
  IconPhone,
  IconCalendar,
  IconUser,
  IconUsers,
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
import { ManageKareGiversDialog } from "@/components/manage-kare-givers-dialog"
import { QuickJournalingDialog } from "@/components/quick-journaling-dialog"
import { useKareRecipients } from "@/lib/hooks/useKareRecipients"
import { KareRecipient } from "@/lib/api/types"
import { Module } from "@/lib/utils/permissions"
import { usePermissions, PermissionGuard } from "@/components/auth/PermissionGuard"
import { toast } from "sonner"

export default function KareRecipientsPage() {
  return (
    <PermissionGuard module={Module.KARE_RECIPIENTS}>
      <KareRecipientsPageContent />
    </PermissionGuard>
  )
}

function KareRecipientsPageContent() {
  const router = useRouter()
  const { data: recipients = [], isLoading, error, deleteKareRecipient } = useKareRecipients()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRecipient, setSelectedRecipient] = useState<number | null>(null)
  const [view, setView] = useState<"card" | "table">("card")
  const [manageGiversOpen, setManageGiversOpen] = useState(false)
  const [journalingOpen, setJournalingOpen] = useState(false)
  const [selectedRecipientName, setSelectedRecipientName] = useState("")
  const { canCreate } = usePermissions(Module.KARE_RECIPIENTS)

  const filteredRecipients = recipients.filter((recipient: KareRecipient) => {
    const query = searchQuery.toLowerCase()
    return (
      (recipient.name && recipient.name.toLowerCase().includes(query)) ||
      (recipient.email && recipient.email.toLowerCase().includes(query)) ||
      (recipient.phone && recipient.phone.includes(query)) ||
      (recipient.relationship && recipient.relationship.toLowerCase().includes(query)) ||
      (recipient.subsciber && recipient.subsciber.toLowerCase().includes(query))
    )
  })

  const handleDelete = (id: string) => {
    setSelectedRecipient(parseInt(id))
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedRecipient) {
      try {
        await deleteKareRecipient.mutateAsync(selectedRecipient)
        toast.success("Kare Recipient deleted successfully")
        setDeleteDialogOpen(false)
        setSelectedRecipient(null)
      } catch (error) {
        toast.error("Failed to delete Kare Recipient")
        console.error("Failed to delete recipient:", error)
      }
    }
  }

  if (error) {
    return (
      <Container>
        <ErrorState message="Error loading Kare Recipients" />
      </Container>
    )
  }

  const columns: ColumnDef<KareRecipient>[] = [
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
      accessorKey: "relationship",
      header: "Relationship",
      cell: (row) => <Badge variant="secondary">{row.relationship || 'N/A'}</Badge>,
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "age",
      header: "Age",
      cell: (row) => `${row.age} years`,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "subsciber",
      header: "Subscriber",
    },
    {
      accessorKey: "providerConnected",
      header: "Provider",
      cell: (row) => (
        <Badge variant={row.providerConnected ? "default" : "secondary"}>
          {row.providerConnected ? "Connected" : "Not Connected"}
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
        <ActionButtons
          module={Module.KARE_RECIPIENTS}
          onEdit={() => router.push(`/kare-recipients/edit/${row.id}`)}
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
            title="Kare Recipients"
            description="Manage care recipient profiles and information"
            actions={
              <>
                <ViewToggle view={view} onViewChange={setView} />
                {canCreate && (
                  <Button
                    onClick={() => router.push("/kare-recipients/add")}
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
            placeholder="Search by name, email, phone, relationship, or subscriber..."
          />
        </FilterSection>

        {/* Table View */}
        {view === "table" && (
          <div className="px-4 lg:px-6">
            <DataTable
              columns={columns}
              data={filteredRecipients}
              onRowClick={(row) => router.push(`/kare-recipients/edit/${row.id}`)}
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingState message="Loading Kare Recipients..." />}

        {/* Card View */}
        {!isLoading && view === "card" && (
          <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            {filteredRecipients.map((recipient) => (
              <ProfileCard
                key={recipient.id}
                icon={<IconHeartbeat className="text-primary h-8 w-8" />}
                title={recipient.name}
                subtitle={
                  <div className="flex items-center gap-1">
                    <IconUser className="h-4 w-4" />
                    <span>{recipient.gender}, {recipient.age} years</span>
                  </div>
                }
                badge={{
                  label: recipient.providerConnected ? "Provider Connected" : "No Provider",
                  variant: recipient.providerConnected ? "default" : "secondary",
                }}
                contactInfo={[
                  {
                    icon: <IconMail className="h-4 w-4" />,
                    label: recipient.email || 'N/A',
                  },
                  {
                    icon: <IconPhone className="h-4 w-4" />,
                    label: recipient.phone || 'N/A',
                  },
                  {
                    icon: <IconUsers className="h-4 w-4" />,
                    label: `Subscriber: ${recipient.subsciber || 'N/A'}`,
                  },
                  {
                    icon: <IconUser className="h-4 w-4" />,
                    label: `Relationship: ${recipient.relationship || 'N/A'}`,
                  },
                  {
                    icon: <IconCalendar className="h-4 w-4" />,
                    label: `Created: ${new Date(recipient.createdDate).toLocaleDateString()}`,
                  },
                ]}
                actions={
                  <div className="space-y-2">
                    {!recipient.providerConnected && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-green-600 text-white"
                        onClick={() => {
                          console.log("Connect provider for:", recipient.id)
                        }}
                      >
                        Connect Provider
                      </Button>
                    )}
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRecipientName(recipient.name)
                          setJournalingOpen(true)
                        }}
                      >
                        Configure Quick Journaling
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRecipientName(recipient.name)
                          setManageGiversOpen(true)
                        }}
                      >
                        Manage Kare Givers
                      </Button>
                    </div>
                    <ActionButtons
                      module={Module.KARE_RECIPIENTS}
                      onEdit={() => router.push(`/kare-recipients/edit/${recipient.id}`)}
                      onDelete={() => handleDelete(recipient.id.toString())}
                    />
                  </div>
                }
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredRecipients.length === 0 && view === "card" && (
          <EmptyState
            icon={<IconHeartbeat className="text-muted-foreground h-10 w-10" />}
            title="No recipients found"
            description={
              searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding a new recipient"
            }
            action={
              !searchQuery && canCreate
                ? {
                    label: "Add New Recipient",
                    onClick: () => router.push("/kare-recipients/add"),
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
        title="Delete Recipient"
        description="Are you sure you want to delete this recipient? This action cannot be undone."
        isDeleting={deleteKareRecipient.isPending}
      />

      {/* Manage Kare Givers Dialog */}
      <ManageKareGiversDialog
        open={manageGiversOpen}
        onOpenChange={setManageGiversOpen}
        recipientName={selectedRecipientName}
      />

      {/* Quick Journaling Dialog */}
      <QuickJournalingDialog
        open={journalingOpen}
        onOpenChange={setJournalingOpen}
        recipientName={selectedRecipientName}
      />
    </Container>
  )
}
