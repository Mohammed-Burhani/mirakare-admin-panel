"use client"

import { useParams } from "next/navigation"
import Container from "@/components/layout/container"
import { MasterValueForm } from "@/components/master-value-form"

export default function EditMasterValuePage() {
  const params = useParams()
  const id = parseInt(params.id as string)

  return (
    <Container>
      <MasterValueForm mode="edit" id={id} />
    </Container>
  )
}