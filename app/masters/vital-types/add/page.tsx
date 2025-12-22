"use client"

import Container from "@/components/layout/container"
import { VitalTypeForm } from "@/components/vital-type-form"

export default function AddVitalTypePage() {
  return (
    <Container>
      <VitalTypeForm mode="add" />
    </Container>
  )
}
