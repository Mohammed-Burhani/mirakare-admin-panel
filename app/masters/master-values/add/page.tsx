"use client"

import Container from "@/components/layout/container"
import { MasterValueForm } from "@/components/master-value-form"

export default function AddMasterValuePage() {
  return (
    <Container>
      <MasterValueForm mode="add" />
    </Container>
  )
}
