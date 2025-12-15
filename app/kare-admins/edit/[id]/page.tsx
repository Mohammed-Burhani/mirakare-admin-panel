"use client"

import { use } from "react"
import Container from "@/components/layout/container"
import { KareAdminForm } from "@/components/kare-admin-form"
import { useKareAdmins } from "@/lib/hooks/useKareAdmins"
import { IconLoader } from "@tabler/icons-react"

export default function EditKareAdminPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: admins = [], isLoading, error } = useKareAdmins()
  
  const admin = admins.find(a => a.id === id)

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

  return (
    <Container>
      <KareAdminForm mode="edit" initialValues={admin} />
    </Container>
  )
}
