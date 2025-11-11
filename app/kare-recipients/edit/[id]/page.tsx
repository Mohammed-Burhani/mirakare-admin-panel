"use client"

import { use } from "react"
import Container from "@/components/layout/container"
import { KareRecipientForm } from "@/components/kare-recipient-form"

// Mock data - in real app, fetch from API
const mockRecipient = {
  relationship: "Father",
  firstName: "Mira",
  middleName: "",
  lastName: "Sharma",
  gender: "Male",
  age: "75",
  email: "mira.sharma@example.com",
  phone: "5551234567",
  addressLine1: "123 Main Street",
  addressLine2: "Apt 4B",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  country: "United States",
  notes: "",
  about: "",
  routines: "",
  preferences: "",
  medications: "",
  contacts: "",
}

export default function EditKareRecipientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  // In real app, fetch recipient data by id
  console.log("Editing recipient with id:", id)

  return (
    <Container>
      <KareRecipientForm mode="edit" initialValues={mockRecipient} />
    </Container>
  )
}
