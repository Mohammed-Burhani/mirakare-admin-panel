"use client"

import { useParams } from "next/navigation"
import Container from "@/components/layout/container"
import { VitalTypeForm } from "@/components/vital-type-form"

export default function EditVitalTypePage() {
  const params = useParams()
  const id = parseInt(params.id as string)

  return (
    <Container>
      <VitalTypeForm mode="edit" id={id} />
    </Container>
  )
}