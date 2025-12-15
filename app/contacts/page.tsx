"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Container from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconMail,
  IconPhone,
  IconCalendar,
  IconUser,
  IconMapPin,
  IconAddressBook,
  IconLoader,
} from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DataTable, ColumnDef } from "@/components/data-table"
import { ViewToggle } from "@/components/view-toggle"
import { useContact } from "@/lib/hooks/useContact"
import { Contact } from "@/lib/api/types"

export default function ContactsPage() {
  const router = useRouter()
  const { data: contacts = [], isLoading, error, deleteContact } = useContact()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<number | null>(null)
  const [view, setView] = useState<"card" | "table">("card")

  const filteredContacts = contacts.filter((contact: Contact) => {
    const fullName = contact.name || 
      `${contact.firstName} ${contact.middleName || ''} ${contact.lastName}`.toLowerCase()
    const query = searchQuery.toLowerCase()
    return (
      fullName.toLowerCase().includes(query) ||
      (contact.email && contact.email.toLowerCase().includes(query)) ||
      (contact.phone && contact.phone.includes(query)) ||
      (contact.phoneNumber && contact.phoneNumber.includes(query)) ||
      (contact.recipient && contact.recipient.toLowerCase().includes(query)) ||
      (contact.type && contact.type.toLowerCase().includes(query)) ||
      (contact.relationship && contact.relationship.toLowerCase().includes(query))
    )
  })

  const handleDelete = (id: number) => {
    setSelectedContact(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedContact) {
      try {
        await deleteContact.mutateAsync(selectedContact)
        setDeleteDialogOpen(false)
        setSelectedContact(null)
      } catch (error) {
        console.error("Failed to delete contact:", error)
      }
    }
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/contacts/edit/${row.id}`)
            }}
          >
            <IconEdit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(row.id)
            }}
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  if (error) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">Error loading contacts</p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
              <p className="text-muted-foreground">
                Manage recipient contacts and emergency information
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ViewToggle view={view} onViewChange={setView} />
              <Button
                onClick={() => router.push("/contacts/add")}
                className="gap-2"
              >
                <IconPlus className="h-4 w-4" />
                Add New
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <IconSearch className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search by name, email, phone, recipient, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table View */}
        {view === "table" && (
          <div className="px-4 lg:px-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2">
                  <IconLoader className="h-4 w-4 animate-spin" />
                  Loading contacts...
                </div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredContacts}
                onRowClick={(row) => router.push(`/contacts/edit/${row.id}`)}
              />
            )}
          </div>
        )}

        {/* Card View */}
        {view === "card" && (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2">
                  <IconLoader className="h-4 w-4 animate-spin" />
                  Loading contacts...
                </div>
              </div>
            ) : (
              <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
                {filteredContacts.map((contact: Contact) => (
              <Card
                key={contact.id}
                className="group relative overflow-hidden transition-all hover:shadow-lg"
              >
                {/* Type Badge */}
                <div className="absolute right-4 top-4 z-10">
                  <Badge variant="secondary" className="shadow-sm">
                    {contact.type || contact.relationship || 'N/A'}
                  </Badge>
                </div>

                <CardContent className="p-6">
                  {/* Profile Section */}
                  <div className="mb-4 flex items-start gap-4">
                    <div className="bg-primary/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full">
                      <IconAddressBook className="text-primary h-8 w-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-xl font-semibold">
                        {contact.name || `${contact.firstName} ${contact.middleName || ''} ${contact.lastName}`}
                      </h3>
                      <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                        <IconUser className="h-4 w-4" />
                        <span>For: {contact.recipient || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center gap-3">
                      <IconMail className="text-muted-foreground h-4 w-4 shrink-0" />
                      <span className="truncate text-sm">{contact.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <IconPhone className="text-muted-foreground h-4 w-4 shrink-0" />
                      <span className="text-sm">{contact.phone || contact.phoneNumber || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <IconMapPin className="text-muted-foreground h-4 w-4 shrink-0" />
                      <span className="text-muted-foreground truncate text-sm">
                        {contact.city || 'N/A'}, {contact.state || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <IconCalendar className="text-muted-foreground h-4 w-4 shrink-0" />
                      <span className="text-muted-foreground text-sm">
                        Created: {contact.createdDate ? new Date(contact.createdDate).toLocaleDateString() : (contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'N/A')}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2 border-t pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() =>
                        router.push(`/contacts/edit/${contact.id}`)
                      }
                    >
                      <IconEdit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDelete(contact.id)}
                    >
                      <IconTrash className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {filteredContacts.length === 0 && view === "card" && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
              <IconAddressBook className="text-muted-foreground h-10 w-10" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No contacts found</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              {searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding a new contact"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => router.push("/contacts/add")}
                className="mt-4 gap-2"
              >
                <IconPlus className="h-4 w-4" />
                Add New Contact
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  )
}
