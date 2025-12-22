"use client"

import { useParams } from "next/navigation"
import Container from "@/components/layout/container"
import { MasterValueForm } from "@/components/master-value-form"
import { useMasterValues } from "@/lib/hooks/useMasterValues"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"

export default function EditMasterValuePage() {
  const params = useParams()
  const id = params.id as string
  const { data: masterValues, isLoading, error } = useMasterValues()

  if (isLoading) {
    return (
      <Container>
        <LoadingState message="Loading master value..." />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorState 
          title="Error loading master value"
          description="There was an error loading the master value data."
        />
      </Container>
    )
  }

  const masterValue = masterValues?.find((mv: any) => mv.id === parseInt(id))

  if (!masterValue) {
    return (
      <Container>
        <ErrorState 
          title="Master value not found"
          description="The requested master value could not be found."
        />
      </Container>
    )
  }

  const initialValues = {
    id: masterValue.id,
    text: masterValue.text || "",
    description: masterValue.description || "",
    type: masterValue.type,
    isPublished: masterValue.isPublished || true,
  }

  return (
    <Container>
      <MasterValueForm mode="edit" initialValues={initialValues} />
    </Container>
  )
}