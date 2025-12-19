"use client"

import { use } from "react"
import Container from "@/components/layout/container"
import { ContactForm } from "@/components/contact-form"
import { useContactById } from "@/lib/hooks/useContact"
import { IconLoader } from "@tabler/icons-react"

export default function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const contactId = parseInt(id)
  const { data: contact, isLoading, error } = useContactById(contactId)

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <IconLoader className="h-4 w-4 animate-spin" />
            Loading contact...
          </div>
        </div>
      </Container>
    )
  }

  if (error || !contact) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">Contact not found</p>
        </div>
      </Container>
    )
  }

  // Map API response to form values
  const initialValues = {
    recipient: contact.recipientId?.toString() || "",
    relationship: contact.relationship?.toString() || "",
    type: contact.type?.toString() || "",
    firstName: contact.fname || "",
    middleName: contact.mname || "",
    lastName: contact.lname || "",
    email: contact.email || "",
    phone: contact.phone || "",
    addressLine1: contact.address1 || "",
    addressLine2: contact.address2 || "",
    city: contact.city || "",
    state: contact.state || "",
    zipCode: contact.zipcode || "",
    country: contact.country || "United States",
    notes: contact.notes || "",
  }

  return (
    <Container>
      <ContactForm 
        mode="edit" 
        contactId={contactId}
        initialValues={initialValues} 
      />
    </Container>
  )
}
