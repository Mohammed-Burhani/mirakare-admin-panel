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

  IconEye,
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
import { useKareViewers } from "@/lib/hooks/useKareViewers"
import { toast } from "sonner"

interface Viewer {
  id: number
  recipientId: number
  recipient: string | null
  name: string
  email: string
  mobile: string
  subscriber: string | null
  createdDate: string
  additionalRole: string | null
}

export default function KareViewersPage() {
  const router = useRouter()
  const { data: viewers = [], isLoading, error, deleteKareViewer } = useKareViewers()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedViewer, setSelectedViewer] = useState<number | null>(null)
  const [view, setView] = useState<"card" | "table">("card")

  const filteredViewers = (viewers as Viewer[]).filter((viewer) => {
    const query = searchQuery.toLowerCase()
    return (
      (viewer.name && viewer.name.toLowerCase().includes(query)) ||
      (viewer.email && viewer.email.toLowerCase().includes(query)) ||
      (viewer.mobile && viewer.mobile.includes(query)) ||
      (viewer.recipient && viewer.recipient.toLowerCase().includes(query)) ||
      (viewer.subscriber && viewer.subscriber.toLowerCase().includes(query))
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
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">Error loading Kare Viewers</p>
        </div>
      </Container>
    )
  }

  const columns: ColumnDef<Viewer>[] = [
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
      accessorKey: "recipient",
      header: "Recipient",
      cell: (row) => row.recipient || 'N/A',
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
      cell: (row) => row.subscriber || 'N/A',
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
              router.push(`/kare-viewers/edit/${row.id}`)
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
        {/* Header Section */}
        <div className="flex flex-col gap-4 px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Kare Viewers
              </h1>
              <p className="text-muted-foreground">
                Manage viewer accounts and access permissions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ViewToggle view={view} onViewChange={setView} />
              <Button
                onClick={() => router.push("/kare-viewers/add")}
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
              placeholder="Search by name, email, mobile, recipient, or subscriber..."
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
                  Loading Kare Viewers...
                </div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredViewers}
                onRowClick={(row) => router.push(`/kare-viewers/edit/${row.id}`)}
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
                  Loading Kare Viewers...
                </div>
              </div>
            ) : (
              <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
                {filteredViewers.map((viewer) => (
              <Card
                key={viewer.id}
                className="group relative overflow-hidden transition-all hover:shadow-lg"
              >
                {/* Recipient Badge */}
                <div className="absolute right-4 top-4 z-10">
                  <Badge variant="secondary" className="shadow-sm">
                    {viewer.recipient || 'No Recipient'}
                  </Badge>
                </div>

                <CardContent className="p-6">
                  {/* Profile Section */}
                  <div className="mb-4 flex items-start gap-4">
                    <div className="bg-primary/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full">
                      <IconEye className="text-primary h-8 w-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-xl font-semibold">
                        {viewer.name}
                      </h3>
                      <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                        <IconUser className="h-4 w-4" />
                        <span>Viewing: {viewer.recipient || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center gap-3">
                      <IconMail className="text-muted-foreground h-4 w-4 shrink-0" />
                      <span className="truncate text-sm">{viewer.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <IconPhone className="text-muted-foreground h-4 w-4 shrink-0" />
                      <span className="text-sm">{viewer.mobile || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <IconUser className="text-muted-foreground h-4 w-4 shrink-0" />
                      <span className="text-muted-foreground truncate text-sm">
                        Subscriber: {viewer.subscriber || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <IconCalendar className="text-muted-foreground h-4 w-4 shrink-0" />
                      <span className="text-muted-foreground text-sm">
                        Created: {new Date(viewer.createdDate).toLocaleDateString()}
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
                        router.push(`/kare-viewers/edit/${viewer.id}`)
                      }
                    >
                      <IconEdit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDelete(viewer.id.toString())}
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
        {filteredViewers.length === 0 && view === "card" && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
              <IconEye className="text-muted-foreground h-10 w-10" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No viewers found</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              {searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding a new viewer"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => router.push("/kare-viewers/add")}
                className="mt-4 gap-2"
              >
                <IconPlus className="h-4 w-4" />
                Add New Viewer
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Viewer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this viewer? This action cannot
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
