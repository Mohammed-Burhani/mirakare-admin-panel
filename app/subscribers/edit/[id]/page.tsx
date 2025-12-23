"use client"

import { useParams } from "next/navigation"
import Container from "@/components/layout/container"
import { SubscriberForm } from "@/components/subscriber-form"

export default function EditSubscriberPage() {
  const params = useParams()
  const id = parseInt(params.id as string)

  return (
    <Container>
      <SubscriberForm mode="edit" id={id} />
    </Container>
  )
}