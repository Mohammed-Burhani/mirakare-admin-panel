"use client"

import { use } from "react"
import Container from "@/components/layout/container"
import { KareViewerForm } from "@/components/kare-viewer-form"
import { useKareViewer } from "@/lib/hooks/useKareViewers"
import { IconLoader } from "@tabler/icons-react"

export default function EditKareViewerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const viewerId = parseInt(id)
  const { data: viewer, isLoading, error } = useKareViewer(viewerId)

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <IconLoader className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading viewer data...</span>
        </div>
      </Container>
    )
  }

  if (error || !viewer) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">Viewer not found or error loading data</p>
        </div>
      </Container>
    )
  }

  // Map API response fields to form field names
  const initialValues = {
    id: viewer.id,
    recipient: '', // This field might need to be mapped differently based on actual API response
    relationship: '',
    firstName: viewer.fname || '',
    middleName: viewer.mname || '',
    lastName: viewer.lname || '',
    mobile: viewer.mobile || '',
    email: viewer.email || '',
    addressLine1: viewer.address1 || '',
    addressLine2: viewer.address2 || '',
    city: viewer.city || '',
    state: viewer.state || '',
    zipCode: viewer.zipcode || '',
    country: viewer.country || 'United States',
    notes: viewer.notes || '',
  }

  return (
    <Container>
      <KareViewerForm mode="edit" initialValues={initialValues} />
    </Container>
  )
}
