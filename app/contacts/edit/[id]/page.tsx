"use client"

import { use } from "react"
import Container from "@/components/layout/container"
import { ContactForm } from "@/components/contact-form"
import { useContact } from "@/lib/hooks/useContact"
import { IconLoader } from "@tabler/icons-react"

export default function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const contactId = parseInt(id)
  const { data: contacts = [], isLoading } = useContact()
  
  const contact = contacts.find((c: any) => c.id === String(contactId))

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

  if (!contact) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">Contact not found</p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <ContactForm 
        mode="edit" 
        contactId={contactId}
        initialValues={contact} 
      />
    </Container>
  )
}
