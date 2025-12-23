"use client"

import { useParams } from "next/navigation"
import Container from "@/components/layout/container"
import { PackageForm } from "@/components/package-form"
import { PermissionGuard } from "@/components/auth/PermissionGuard"
import { Module, Permission } from "@/lib/utils/permissions"

export default function EditPackagePage() {
  const params = useParams()
  const id = parseInt(params.id as string)

  return (
    <PermissionGuard module={Module.PACKAGES} permission={Permission.UPDATE}>
      <Container>
        <PackageForm mode="edit" id={id} />
      </Container>
    </PermissionGuard>
  )
}