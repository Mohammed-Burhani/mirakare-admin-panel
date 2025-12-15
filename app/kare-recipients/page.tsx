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
  IconHeartbeat,
  IconMail,
  IconPhone,
  IconCalendar,
  IconUser,
  IconUsers,
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
import { ManageKareGiversDialog } from "@/components/manage-kare-givers-dialog"
import { QuickJournalingDialog } from "@/components/quick-journaling-dialog"
import { useKareRecipients } from "@/lib/hooks/useKareRecipients"
import { toast } from "sonner"

export default function KareRecipientsPage() {
  const router = useRouter()
  const { data: recipients = [], isLoading, error, deleteKareRecipient } = useKareRecipients()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRecipient, setSelectedRecipient] = useState<number | null>(
    null
  )
  const [view, setView] = useState<"card" | "table">("card")
  const [manageGiversOpen, setManageGiversOpen] = useState(false)
  const [journalingOpen, setJournalingOpen] = useState(false)
  const [selectedRecipientName, setSelectedRecipientName] = useState("")

  const filteredRecipients = recipients.filter((recipient: any) => {
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
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">Error loading Kare Recipients</p>
        </div>
      </Container>
    )
  }

  const columns: ColumnDef<unknown>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "relationship",
      header: "Relationship",
      cell: ({ row }) => <Badge variant="secondary">{row.original.relationship || 'N/A'}</Badge>,
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "age",
      header: "Age",
      cell: ({ row }) => `${row.original.age} years`,
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
      cell: ({ row }) => (
        <Badge variant={row.original.providerConnected ? "default" : "secondary"}>
          {row.original.providerConnected ? "Connected" : "Not Connected"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdDate",
      header: "Created Date",
      cell: ({ row }) => new Date(row.original.createdDate).toLocaleDateString(),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/kare-recipients/edit/${row.original.id}`)
            }}
          >
            <IconEdit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(row.original.id)
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
              <h1 className="text-3xl font-bold tracking-tight">
                Kare Recipients
              </h1>
              <p className="text-muted-foreground">
                Manage care recipient profiles and information
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ViewToggle view={view} onViewChange={setView} />
              <Button
                onClick={() => router.push("/kare-recipients/add")}
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
              placeholder="Search by name, email, phone, relationship, or subscriber..."
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
              data={filteredRecipients}
              onRowClick={(row) => router.push(`/kare-recipients/edit/${row.id}`)}
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <IconLoader className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading Kare Recipients...</span>
          </div>
        )}

        {/* Card View */}
        {!isLoading && view === "card" && (
          <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            {filteredRecipients.map((recipient) => (
            <Card
              key={recipient.id}
              className="group relative overflow-hidden transition-all hover:shadow-lg"
            >
              {/* Provider Status Badge */}
              <div className="absolute right-4 top-4 z-10">
                <Badge variant={recipient.providerConnected ? "default" : "secondary"} className="shadow-sm">
                  {recipient.providerConnected ? "Provider Connected" : "No Provider"}
                </Badge>
              </div>

              <CardContent className="p-6">
                {/* Profile Section */}
                <div className="mb-4 flex items-start gap-4">
                  <div className="bg-primary/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full">
                    <IconUser className="text-primary h-8 w-8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xl font-semibold">
                      {recipient.name}
                    </h3>
                    <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                      <IconHeartbeat className="h-4 w-4" />
                      <span>
                        {recipient.gender}, {recipient.age} years
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center gap-3">
                    <IconMail className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="truncate text-sm">{recipient.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <IconPhone className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="text-sm">{recipient.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <IconUsers className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="text-muted-foreground truncate text-sm">
                      Subscriber: {recipient.subsciber || 'N/A'}
                    </span>
                  </div>
                  {recipient.relationship && (
                    <div className="flex items-center gap-3">
                      <IconUser className="text-muted-foreground h-4 w-4 shrink-0" />
                      <span className="text-muted-foreground truncate text-sm">
                        Relationship: {recipient.relationship}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <IconCalendar className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="text-muted-foreground text-sm">
                      Created: {new Date(recipient.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 space-y-2 border-t pt-4">
                  {!recipient.providerConnected && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        console.log("Connect provider for:", recipient.id)
                      }}
                    >
                      Connect Provider
                    </Button>
                  )}
                  <div className="grid grid-cols-2 gap-2">
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() =>
                        router.push(`/kare-recipients/edit/${recipient.id}`)
                      }
                    >
                      <IconEdit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDelete(recipient.id)}
                    >
                      <IconTrash className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredRecipients.length === 0 && view === "card" && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
              <IconHeartbeat className="text-muted-foreground h-10 w-10" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No recipients found</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              {searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding a new recipient"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => router.push("/kare-recipients/add")}
                className="mt-4 gap-2"
              >
                <IconPlus className="h-4 w-4" />
                Add New Recipient
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Recipient</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this recipient? This action cannot
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
