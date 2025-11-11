"use client"

import { use } from "react"
import Container from "@/components/layout/container"
import { KareViewerForm } from "@/components/kare-viewer-form"

// Mock data - in real app, fetch based on id
const mockViewerData = {
  recipient: "Mira Sharma",
  relationship: "Son",
  firstName: "John",
  middleName: "",
  lastName: "Doe",
  mobile: "5551234567",
  email: "john.doe@example.com",
  addressLine1: "123 Main Street",
  addressLine2: "Apt 4B",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  country: "United States",
  notes: "",
}

export default function EditKareViewerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  // In a real app, fetch data based on id
  console.log("Editing viewer with id:", id)

  return (
    <Container>
      <KareViewerForm mode="edit" initialValues={mockViewerData} />
    </Container>
  )
}
