"use client"

import Container from "@/components/layout/container"
import { SubscriberForm } from "@/components/subscriber-form"

export default function AddSubscriberPage() {
  return (
    <Container>
      <SubscriberForm mode="add" />
    </Container>
  )
}
