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
} from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock data
const mockAdmins = [
  {
    id: 1,
    firstName: "Vik",
    middleName: "",
    lastName: "Sharma",
    email: "mkkaregiver@gmail.com",
    mobile: "4287653109",
    addressLine1: "33 Wood Avenue South Suite 600",
    addressLine2: "Iselin, NJ, 08830",
    city: "Iselin",
    state: "NEW JERSEY",
    zipCode: "08830",
    country: "United States",
    notes: "",
    createdDate: "12/24/2023",
    status: "Active",
  },
]

export default function KareAdminsPage() {
  const router = useRouter()
  const [admins] = useState(mockAdmins)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<number | null>(null)

  const filteredAdmins = admins.filter((admin) => {
    const fullName = `${admin.firstName} ${admin.middleName} ${admin.lastName}`.toLowerCase()
    const query = searchQuery.toLowerCase()
    return (
      fullName.includes(query) ||
      admin.email.toLowerCase().includes(query) ||
      admin.mobile.includes(query)
    )
  })

  const handleDelete = (id: number) => {
    setSelectedAdmin(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // Delete logic here
    console.log("Deleting admin:", selectedAdmin)
    setDeleteDialogOpen(false)
    setSelectedAdmin(null)
  }

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
            <Button
              onClick={() => router.push("/kare-admins/add")}
              className="gap-2"
            >
              <IconPlus className="h-4 w-4" />
              Add New
            </Button>
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

        {/* Admin Cards Grid */}
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

        {/* Empty State */}
        {filteredAdmins.length === 0 && (
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
