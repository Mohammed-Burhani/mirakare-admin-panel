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
  IconMapPin,
  IconAddressBook,
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
import { useContact } from "@/lib/hooks/useContact"
import { Contact } from "@/lib/api/types"
import { Module } from "@/lib/utils/permissions"
import { usePermissions, PermissionGuard } from "@/components/auth/PermissionGuard"
import { toast } from "sonner"

export default function ContactsPage() {
  return (
    <PermissionGuard module={Module.CONTACTS}>
      <ContactsPageContent />
    </PermissionGuard>
  )
}

function ContactsPageContent() {
  const router = useRouter()
  const { data: contacts = [], isLoading, error, deleteContact } = useContact()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<number | null>(null)
  const [view, setView] = useState<"card" | "table">("card")
  const { canCreate } = usePermissions(Module.CONTACTS)

  const filteredContacts = contacts.filter((contact: Contact) => {
    const fullName = contact.name || 
      `${contact.firstName} ${contact.middleName || ''} ${contact.lastName}`.toLowerCase()
    const query = searchQuery.toLowerCase()
    return (
      fullName.toLowerCase().includes(query) ||
      (contact.email && contact.email.toLowerCase().includes(query)) ||
      (contact.phone && contact.phone.includes(query)) ||
      (contact.phoneNumber && contact.phoneNumber.includes(query)) ||
      (contact.recipient && contact.recipient.toLowerCase().includes(query))
    )
  })

  const handleDelete = (id: string) => {
    setSelectedContact(parseInt(id))
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedContact) {
      try {
        await deleteContact.mutateAsync(selectedContact)
        toast.success("Contact deleted successfully")
        setDeleteDialogOpen(false)
        setSelectedContact(null)
      } catch (error) {
        toast.error("Failed to delete contact")
        console.error("Failed to delete contact:", error)
      }
    }
  }

  if (error) {
    return (
      <Container>
        <ErrorState message="Error loading contacts" />
      </Container>
    )
  }

  const columns: ColumnDef<Contact>[] = [
    {
      accessorKey: "type",
      header: "Type",
      cell: (row) => <Badge variant="secondary">{row.type || row.relationship || 'N/A'}</Badge>,
    },
    {
      accessorKey: "recipient",
      header: "Recipient",
      cell: (row) => row.recipient || 'N/A',
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (row) => (
        <div className="font-medium">
          {row.name || `${row.firstName} ${row.middleName || ''} ${row.lastName}`}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: (row) => row.phone || row.phoneNumber || 'N/A',
    },
    {
      accessorKey: "createdDate",
      header: "Created Date",
    },
    {
      header: "Actions",
      cell: (row) => (
        <ActionButtons
          module={Module.CONTACTS}
          onEdit={() => router.push(`/contacts/edit/${row.id}`)}
          onDelete={() => handleDelete(row.id.toString())}
          layout="horizontal"
        />
      ),
    },
  ]

  if (error) {
    return (
      <Container>
        <ErrorState message="Error loading contacts" />
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <FilterSection>
          <PageHeader
            title="Contacts"
            description="Manage recipient contacts and emergency information"
            actions={
              <>
                <ViewToggle view={view} onViewChange={setView} />
                {canCreate && (
                  <Button
                    onClick={() => router.push("/contacts/add")}
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
            placeholder="Search by name, email, phone, recipient, or type..."
          />
        </FilterSection>

        {/* Table View */}
        {view === "table" && (
          <div className="px-4 lg:px-6">
            <DataTable
              columns={columns}
              data={filteredContacts}
              onRowClick={(row) => router.push(`/contacts/edit/${row.id}`)}
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingState message="Loading contacts..." />}

        {/* Card View */}
        {!isLoading && view === "card" && (
          <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            {filteredContacts.map((contact: Contact) => (
              <ProfileCard
                key={contact.id}
                icon={<IconAddressBook className="text-primary h-8 w-8" />}
                title={contact.name || `${contact.firstName} ${contact.middleName || ''} ${contact.lastName}`}
                subtitle={
                  <div className="flex items-center gap-1">
                    <IconUser className="h-4 w-4" />
                    <span>For: {contact.recipient || 'N/A'}</span>
                  </div>
                }
                badge={{
                  label: (typeof contact.type === 'string' ? contact.type : contact.type?.toString()) || 
                         (typeof contact.relationship === 'string' ? contact.relationship : contact.relationship?.toString()) || 'N/A',
                  variant: "secondary",
                }}
                contactInfo={[
                  {
                    icon: <IconMail className="h-4 w-4" />,
                    label: contact.email || 'N/A',
                  },
                  {
                    icon: <IconPhone className="h-4 w-4" />,
                    label: contact.phone || contact.phoneNumber || 'N/A',
                  },
                  {
                    icon: <IconMapPin className="h-4 w-4" />,
                    label: `${contact.city || 'N/A'}, ${contact.state || 'N/A'}`,
                  },
                  {
                    icon: <IconCalendar className="h-4 w-4" />,
                    label: `Created: ${contact.createdDate ? new Date(contact.createdDate).toLocaleDateString() : (contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'N/A')}`,
                  },
                ]}
                actions={
                  <ActionButtons
                    module={Module.CONTACTS}
                    onEdit={() => router.push(`/contacts/edit/${contact.id}`)}
                    onDelete={() => handleDelete(contact.id.toString())}
                  />
                }
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredContacts.length === 0 && view === "card" && (
          <EmptyState
            icon={<IconAddressBook className="text-muted-foreground h-10 w-10" />}
            title="No contacts found"
            description={
              searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding a new contact"
            }
            action={
              !searchQuery && canCreate
                ? {
                    label: "Add New Contact",
                    onClick: () => router.push("/contacts/add"),
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
        title="Delete Contact"
        description="Are you sure you want to delete this contact? This action cannot be undone."
        isDeleting={deleteContact.isPending}
      />
    </Container>
  )
}
