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
  IconShieldCheck,
  IconMail,
  IconPhone,
  IconCalendar,
  IconUser,
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
import { useKareAdmins } from "@/lib/hooks/useKareAdmins"
import { toast } from "sonner"

export default function KareAdminsPage() {
  const router = useRouter()
  const { data: admins = [], isLoading, deleteKareAdmin } = useKareAdmins()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<number | null>(null)
  const [view, setView] = useState<"card" | "table">("card")

  const filteredAdmins = admins.filter((admin) => {
    const fullName = `${admin.firstName} ${admin.middleName} ${admin.lastName}`.toLowerCase()
    const query = searchQuery.toLowerCase()
    return (
      fullName.includes(query) ||
      admin.email.toLowerCase().includes(query) ||
      admin.mobile.includes(query)
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

  const columns: ColumnDef<unknown>[] = [
    {
      accessorKey: "firstName",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.firstName} {row.original.middleName} {row.original.lastName}
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
      cell: ({ row }) => `${row.original.city}, ${row.original.state}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "Active" ? "default" : "secondary"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "createdDate",
      header: "Created Date",
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
              router.push(`/kare-admins/edit/${row.original.id}`)
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
              <h1 className="text-3xl font-bold tracking-tight">Kare Admins</h1>
              <p className="text-muted-foreground">
                Manage administrator accounts and permissions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ViewToggle view={view} onViewChange={setView} />
              <Button
                onClick={() => router.push("/kare-admins/add")}
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
            <Card
              key={admin.id}
              className="group relative overflow-hidden transition-all hover:shadow-lg"
            >
              {/* Status Badge */}
              <div className="absolute right-4 top-4 z-10">
                <Badge
                  variant={admin.status === "Active" ? "default" : "secondary"}
                  className="shadow-sm"
                >
                  {admin.status}
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
                      {admin.firstName} {admin.middleName} {admin.lastName}
                    </h3>
                    <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                      <IconShieldCheck className="h-4 w-4" />
                      <span>Administrator</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center gap-3">
                    <IconMail className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="truncate text-sm">{admin.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <IconPhone className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="text-sm">{admin.mobile}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <IconCalendar className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="text-muted-foreground text-sm">
                      Created: {admin.createdDate}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2 border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => router.push(`/kare-admins/edit/${admin.id}`)}
                  >
                    <IconEdit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDelete(admin.id)}
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <IconLoader className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading Kare Admins...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredAdmins.length === 0 && view === "card" && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
              <IconShieldCheck className="text-muted-foreground h-10 w-10" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No admins found</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              {searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding a new admin"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => router.push("/kare-admins/add")}
                className="mt-4 gap-2"
              >
                <IconPlus className="h-4 w-4" />
                Add New Admin
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Admin</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this admin? This action cannot be
              undone.
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
