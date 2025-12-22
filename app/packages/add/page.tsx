"use client"

import Container from "@/components/layout/container"
import { PackageForm } from "@/components/package-form"

export default function AddPackagePage() {
  return (
    <Container>
      <PackageForm mode="add" />
    </Container>
  )
}