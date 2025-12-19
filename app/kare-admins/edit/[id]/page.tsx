"use client"

import { use } from "react"
import Container from "@/components/layout/container"
import { KareAdminForm } from "@/components/kare-admin-form"
import { useKareAdmin } from "@/lib/hooks/useKareAdmins"
import { IconLoader } from "@tabler/icons-react"

export default function EditKareAdminPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const adminId = parseInt(id)
  const { data: admin, isLoading, error } = useKareAdmin(adminId)

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <IconLoader className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading admin data...</span>
        </div>
      </Container>
    )
  }

  if (error || !admin) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">Admin not found or error loading data</p>
        </div>
      </Container>
    )
  }

  // Map API response fields to form field names
  const initialValues = {
    id: admin.id,
    firstName: admin.fname || '',
    middleName: admin.mname || '',
    lastName: admin.lname || '',
    mobile: admin.mobile || '',
    email: admin.email || '',
    addressLine1: admin.address1 || '',
    addressLine2: admin.address2 || '',
    city: admin.city || '',
    state: admin.state || '',
    zipCode: admin.zipcode || '',
    country: admin.country || 'United States',
    notes: admin.notes || '',
  }

  return (
    <Container>
      <KareAdminForm mode="edit" initialValues={initialValues} />
    </Container>
  )
}
