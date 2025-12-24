"use client"

import Container from "@/components/layout/container"
import { PageHeader } from "@/components/page-header"
import { Module } from "@/lib/utils/permissions"
import { PermissionGuard } from "@/components/auth/PermissionGuard"
import { OrganizationProfileForm } from "@/components/organization-profile-form"

export default function OrganizationProfilePage() {
  return (
    <PermissionGuard module={Module.ORGANIZATION_PROFILE}>
      <OrganizationProfilePageContent />
    </PermissionGuard>
  )
}

function OrganizationProfilePageContent() {
  return (
    <Container>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <PageHeader
            title="Organization Profile"
            description="Manage your organization's profile and settings"
          />
        </div>

        <div className="px-4 lg:px-6">
          <OrganizationProfileForm />
        </div>
      </div>
    </Container>
  )
}