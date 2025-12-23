"use client"

import Container from "@/components/layout/container"
import { PackageForm } from "@/components/package-form"
import { PermissionGuard } from "@/components/auth/PermissionGuard"
import { Module, Permission } from "@/lib/utils/permissions"

export default function AddPackagePage() {
  return (
    <PermissionGuard module={Module.PACKAGES} permission={Permission.CREATE}>
      <Container>
        <PackageForm mode="add" />
      </Container>
    </PermissionGuard>
  )
}