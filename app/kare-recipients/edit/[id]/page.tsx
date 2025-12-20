"use client"

import { use, Suspense } from "react"
import Container from "@/components/layout/container"
import { KareRecipientForm } from "@/components/kare-recipient-form"
import { useKareRecipient } from "@/lib/hooks/useKareRecipients"
import { IconLoader } from "@tabler/icons-react"

function EditKareRecipientContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const recipientId = parseInt(id)
  const { data: recipient, isLoading, error } = useKareRecipient(recipientId)

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <IconLoader className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading recipient data...</span>
        </div>
      </Container>
    )
  }

  if (error || !recipient) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">Recipient not found or error loading data</p>
        </div>
      </Container>
    )
  }

  // Parse the name field back to firstName, middleName, lastName
  const nameParts = (recipient.name || '').split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts[nameParts.length - 1] || ''
  const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : ''

  const initialValues = {
    id: recipient.id,
    relationship: recipient.relationship || '',
    firstName,
    middleName,
    lastName,
    gender: recipient.gender || '',
    age: recipient.age?.toString() || '',
    email: recipient.email || '',
    phone: recipient.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    notes: '',
    about: '',
    routines: '',
    preferences: '',
    medications: '',
    contacts: '',
  }

  return (
    <Container>
      <KareRecipientForm mode="edit" initialValues={initialValues} />
    </Container>
  )
}

export default function EditKareRecipientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense fallback={
      <Container>
        <div className="flex items-center justify-center py-12">
          <IconLoader className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading recipient data...</span>
        </div>
      </Container>
    }>
      <EditKareRecipientContent params={params} />
    </Suspense>
  )
}
