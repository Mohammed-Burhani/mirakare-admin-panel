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

// Mock data
const mockContacts = [
  {
    id: 1,
    recipient: "Mira Sharma",
    relationship: "Family",
    type: "Family",
    firstName: "Neelam",
    middleName: "",
    lastName: "Khanna",
    email: "neelam.khanna@gmail.com",
    phone: "9084152180",
    addressLine1: "123 Main Street",
    addressLine2: "Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    notes: "",
    createdDate: "12/25/2023",
  },
  {
    id: 2,
    recipient: "Mira Sharma",
    relationship: "Medical",
    type: "Medical",
    firstName: "Dr. Nagarathna",
    middleName: "",
    lastName: "Prabhram",
    email: "no@email.com",
    phone: "7322471510",
    addressLine1: "456 Oak Avenue",
    addressLine2: "",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    country: "United States",
    notes: "",
    createdDate: "5/17/2024",
  },
]

export default function ContactsPage() {
  const router = useRouter()
  const [contacts] = useState(mockContacts)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<number | null>(null)
  const [view, setView] = useState<"card" | "table">("card")

  const filteredContacts = contacts.filter((contact) => {
    const fullName =
      `${contact.firstName} ${contact.middleName} ${contact.lastName}`.toLowerCase()
    const query = searchQuery.toLowerCase()
    return (
      fullName.includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.phone.includes(query) ||
      contact.recipient.toLowerCase().includes(query) ||
      contact.type.toLowerCase().includes(query)
    )
  })

  const handleDelete = (id: number) => {
    setSelectedContact(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    console.log("Deleting contact:", selectedContact)
    setDeleteDialogOpen(false)
    setSelectedContact(null)
  }

  const columns: ColumnDef<(typeof mockContacts)[0]>[] = [
    {
      accessorKey: "type",
      header: "Type",
      cell: (row) => <Badge variant="secondary">{row.type}</Badge>,
    },
    {
      accessorKey: "recipient",
      header: "Recipient",
    },
    {
      accessorKey: "firstName",
      header: "Name",
      cell: (row) => (
        <div className="font-medium">
          {row.firstName} {row.middleName} {row.lastName}
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
            <DataTable
              columns={columns}
              data={filteredContacts}
              onRowClick={(row) => router.push(`/contacts/edit/${row.id}`)}
            />
          </div>
        )}

        {/* Card View */}
        {view === "card" && (
          <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            {filteredContacts.map((contact) => (
              <Card
                key={contact.id}
                className="group relative overflow-hidden transition-all hover:shadow-lg"
              >
                {/* Type Badge */}
                <div className="absolute right-4 top-4 z-10">
                  <Badge variant="secondary" className="shadow-sm">
                    {contact.type}
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
                        {contact.firstName} {contact.middleName}{" "}
                        {contact.lastName}
                      </h3>
                      <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                        <IconUser className="h-4 w-4" />
                        <span>For: {contact.recipient}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center gap-3">
                      <IconMail className="text-muted-foreground h-4 w-4 shrink-0" />
                      <span className="truncate text-sm">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <IconPhone className="text-muted-foreground h-4 w-4 shrink-0" />
                      <span className="text-sm">{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <IconMapPin className="text-muted-foreground h-4 w-4 shrink-0" />
                      <span className="text-muted-foreground truncate text-sm">
                        {contact.city}, {contact.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <IconCalendar className="text-muted-foreground h-4 w-4 shrink-0" />
                      <span className="text-muted-foreground text-sm">
                        Created: {contact.createdDate}
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
