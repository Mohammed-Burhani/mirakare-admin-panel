"use client"

import { useParams } from "next/navigation"
import Container from "@/components/layout/container"
import { PackageForm } from "@/components/package-form"

export default function EditPackagePage() {
  const params = useParams()
  const id = parseInt(params.id as string)

  return (
    <Container>
      <PackageForm mode="edit" id={id} />
    </Container>
  )
}