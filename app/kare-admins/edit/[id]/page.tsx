"use client"

import { use, Suspense } from "react"
import Container from "@/components/layout/container"
import { KareAdminForm } from "@/components/kare-admin-form"
import { useKareAdmin } from "@/lib/hooks/useKareAdmins"
import { IconLoader } from "@tabler/icons-react"

function EditKareAdminContent({ params }: { params: Promise<{ id: string }> }) {
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
    firstName: admin.name ? admin.name.split(' ')[0] || '' : '',
    middleName: '',
    lastName: admin.name ? admin.name.split(' ').slice(1).join(' ') || '' : '',
    mobile: admin.mobile || '',
    email: admin.email || '',
  }

  return (
    <Container>
      <KareAdminForm mode="edit" initialValues={initialValues} />
    </Container>
  )
}

export default function EditKareAdminPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense fallback={
      <Container>
        <div className="flex items-center justify-center py-12">
          <IconLoader className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading admin data...</span>
        </div>
      </Container>
    }>
      <EditKareAdminContent params={params} />
    </Suspense>
  )
}
