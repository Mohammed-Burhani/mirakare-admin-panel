"use client"

import { use } from "react"
import Container from "@/components/layout/container"
import { KareRecipientForm } from "@/components/kare-recipient-form"
import { useKareRecipients } from "@/lib/hooks/useKareRecipients"
import { IconLoader } from "@tabler/icons-react"

export default function EditKareRecipientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: recipients = [], isLoading, error } = useKareRecipients()
  
  const recipient = recipients.find(r => r.id === id)

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

  return (
    <Container>
      <KareRecipientForm mode="edit" initialValues={recipient} />
    </Container>
  )
}
