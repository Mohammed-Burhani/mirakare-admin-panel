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
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">Error loading Kare Viewers</p>
        </div>
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
              {canCreate && (
                <Button
                  onClick={() => router.push("/kare-viewers/add")}
                  className="gap-2"
                >
                  <IconPlus className="h-4 w-4" />
                  Add New
                </Button>
              )}
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
                {filteredViewers.map((viewer: KareViewer) => {
                  const name = `${viewer.fname} ${viewer.lname}`.trim()
                  return (
              <Card
                key={viewer.id}
                className="group relative overflow-hidden transition-all hover:shadow-lg"
              >
                {/* Recipient Badge */}
                <div className="absolute right-4 top-4 z-10">
                  <Badge variant="secondary" className="shadow-sm">
                    Recipient ID: {viewer.recipientId}
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
                        {name}
                      </h3>
                      <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                        <IconUser className="h-4 w-4" />
                        <span>Recipient ID: {viewer.recipientId}</span>
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
                        Subscriber ID: {viewer.subscriberId}
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
                  <div className="mt-4 border-t pt-4">
                    <ActionButtons
                      module={Module.KARE_VIEWERS}
                      onEdit={() => router.push(`/kare-viewers/edit/${viewer.id}`)}
                      onDelete={() => handleDelete(viewer.id.toString())}
                    />
                  </div>
                </CardContent>
              </Card>
                  )
                })}
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
            {!searchQuery && canCreate && (
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
