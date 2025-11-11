"use client"

import { use } from "react"
import Container from "@/components/layout/container"
import { KareGiverForm } from "@/components/kare-giver-form"

// Mock data - in real app, fetch based on id
const mockGiverData = {
  firstName: "Monica",
  middleName: "",
  lastName: "R",
  mobile: "7327180652",
  email: "mirasbabygirl@gmail.com",
  addressLine1: "123 Main Street",
  addressLine2: "Apt 4B",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  country: "United States",
  notes: "",
}

export default function EditKareGiverPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  
  // In a real app, fetch data based on id
  console.log("Editing giver with id:", id)

  return (
    <Container>
      <KareGiverForm mode="edit" initialValues={mockGiverData} />
    </Container>
  )
}
