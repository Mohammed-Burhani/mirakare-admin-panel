"use client"

import { use } from "react"
import Container from "@/components/layout/container"
import { KareAdminForm } from "@/components/kare-admin-form"

// Mock data - in real app, fetch from API
const mockAdmin = {
  firstName: "Vik",
  middleName: "",
  lastName: "Sharma",
  mobile: "4287653109",
  email: "mkkaregiver@gmail.com",
  addressLine1: "33 Wood Avenue South Suite 600",
  addressLine2: "Iselin, NJ, 08830",
  city: "Iselin",
  state: "NEW JERSEY",
  zipCode: "08830",
  country: "United States",
  notes: "",
}

export default function EditKareAdminPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  
  // In real app, fetch admin data by id
  console.log("Editing admin with id:", id)

  return (
    <Container>
      <KareAdminForm mode="edit" initialValues={mockAdmin} />
    </Container>
  )
}
