"use client"

import { use } from "react"
import Container from "@/components/layout/container"
import { ContactForm } from "@/components/contact-form"

// Mock data - in real app, fetch based on id
const mockContactData = {
  recipient: "Mira Sharma",
  relationship: "Family",
  type: "Family",
  firstName: "Neelam",
  middleName: "",
  lastName: "Khanna",
  email: "neelam.khanna@gmail.com",
  phone: "9084152180",
  addressLine1: "123 Main Street",
  addressLine2: "Apt 4B",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  country: "United States",
  notes: "",
}

export default function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  // In a real app, fetch data based on id
  console.log("Editing contact with id:", id)

  return (
    <Container>
      <ContactForm mode="edit" initialValues={mockContactData} />
    </Container>
  )
}
