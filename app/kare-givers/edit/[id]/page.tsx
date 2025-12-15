"use client"

import { use } from "react"
import Container from "@/components/layout/container"
import { KareGiverForm } from "@/components/kare-giver-form"
import { useKareGivers } from "@/lib/hooks/useKareGivers"
import { IconLoader } from "@tabler/icons-react"

export default function EditKareGiverPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const giverId = parseInt(id)
  const { data: givers = [], isLoading } = useKareGivers()
  
  const giver = givers.find((g: unknown) => g.id === String(giverId))

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <IconLoader className="h-4 w-4 animate-spin" />
            Loading Kare Giver...
          </div>
        </div>
      </Container>
    )
  }

  if (!giver) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">Kare Giver not found</p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <KareGiverForm 
        mode="edit" 
        giverId={giverId}
        initialValues={{
          firstName: giver.firstName || '',
          middleName: giver.middleName || '',
          lastName: giver.lastName || '',
          mobile: giver.mobile || giver.phoneNumber || '',
          email: giver.email || '',
          addressLine1: giver.addressLine1 || '',
          addressLine2: giver.addressLine2 || '',
          city: giver.city || '',
          state: giver.state || '',
          zipCode: giver.zipCode || '',
          country: giver.country || 'United States',
          notes: giver.notes || '',
        }} 
      />
    </Container>
  )
}
