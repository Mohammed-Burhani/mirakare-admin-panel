"use client"

import { use, Suspense } from "react"
import Container from "@/components/layout/container"
import { KareGiverForm } from "@/components/kare-giver-form"
import { useKareGiver } from "@/lib/hooks/useKareGivers"
import { IconLoader } from "@tabler/icons-react"

function EditKareGiverContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const giverId = parseInt(id)
  const { data: giver, isLoading, error } = useKareGiver(giverId)

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

  if (error || !giver) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">Kare Giver not found</p>
        </div>
      </Container>
    )
  }

  // Map API response fields to form field names
  const initialValues = {
    id: giver.id,
    firstName: giver.fname || '',
    middleName: giver.mname || '',
    lastName: giver.lname || '',
    mobile: giver.mobile || '',
    email: giver.email || '',
    addressLine1: giver.address1 || '',
    addressLine2: giver.address2 || '',
    city: giver.city || '',
    state: giver.state || '',
    zipCode: giver.zipcode || '',
    country: giver.country || 'United States',
    notes: giver.notes || '',
  }

  return (
    <Container>
      <KareGiverForm 
        mode="edit" 
        giverId={giverId}
        initialValues={initialValues}
      />
    </Container>
  )
}

export default function EditKareGiverPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense fallback={
      <Container>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <IconLoader className="h-4 w-4 animate-spin" />
            Loading Kare Giver...
          </div>
        </div>
      </Container>
    }>
      <EditKareGiverContent params={params} />
    </Suspense>
  )
}
