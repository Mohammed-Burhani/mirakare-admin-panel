"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Container from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { useKareGivers } from "@/lib/hooks/useKareGivers"
import { toast } from "sonner"

export default function KareGiversPage() {
  const router = useRouter()
  const { data: givers = [], isLoading, error, deleteKareGiver } = useKareGivers()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedGiver, setSelectedGiver] = useState<number | null>(null)
  const [view, setView] = useState<"card" | "table">("card")

  const filteredGivers = givers.filter((giver: any) => {
    const fullName =
      `${giver.firstName} ${giver.middleName || ''} ${giver.lastName}`.toLowerCase()
    const query = searchQuery.toLowerCase()
    return (
      fullName.includes(query) ||
      (giver.email && giver.email.toLowerCase().includes(query)) ||
      (giver.mobile && giver.mobile.includes(query))
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
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">Error loading Kare Givers</p>
        </div>
      </Container>
    )
  }

  const columns: ColumnDef<any>[] = [
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
      accessorKey: "mobile",
      header: "Mobile",
    },
    {
      header: "Location",
      cell: (row) => `${row.city}, ${row.state}`,
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
              router.push(`/kare-givers/edit/${row.id}`)
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
              <h1 className="text-3xl font-bold tracking-tight">
                Kare Givers
              </h1>
              <p className="text-muted-foreground">
                Manage caregiver profiles and information
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ViewToggle view={view} onViewChange={setView} />
              <Button
                onClick={() => router.push("/kare-givers/add")}
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
              placeholder="Search by name, email, or mobile..."
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
                  Loading Kare Givers...
                </div>
              </div>
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
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2">
                  <IconLoader className="h-4 w-4 animate-spin" />
                  Loading Kare Givers...
                </div>
              </div>
            ) : (
              <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
                {filteredGivers.map((giver: unknown) => (
            <Card
              key={giver.id}
              className="group relative overflow-hidden transition-all hover:shadow-lg"
            >
              <CardContent className="p-6">
                {/* Profile Section */}
                <div className="mb-4 flex items-start gap-4">
                  <div className="bg-primary/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full">
                    <IconUser className="text-primary h-8 w-8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xl font-semibold">
                      {giver.firstName} {giver.middleName || ''} {giver.lastName}
                    </h3>
                    <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                      <IconMapPin className="h-4 w-4" />
                      <span className="truncate">
                        {giver.city || 'N/A'}, {giver.state || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center gap-3">
                    <IconMail className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="truncate text-sm">{giver.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <IconPhone className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="text-sm">{giver.mobile || giver.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <IconCalendar className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="text-muted-foreground text-sm">
                      Created: {giver.createdDate || new Date(giver.createdAt).toLocaleDateString()}
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
                      router.push(`/kare-givers/edit/${giver.id}`)
                    }
                  >
                    <IconEdit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDelete(giver.id)}
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
        {filteredGivers.length === 0 && view === "card" && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
              <IconUser className="text-muted-foreground h-10 w-10" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No givers found</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              {searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding a new caregiver"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => router.push("/kare-givers/add")}
                className="mt-4 gap-2"
              >
                <IconPlus className="h-4 w-4" />
                Add New Giver
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Caregiver</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this caregiver? This action cannot
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
