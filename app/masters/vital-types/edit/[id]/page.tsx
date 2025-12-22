"use client"

import { useParams } from "next/navigation"
import Container from "@/components/layout/container"
import { VitalTypeForm } from "@/components/vital-type-form"
import { useVitalTypes } from "@/lib/hooks/useVitalTypes"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"

export default function EditVitalTypePage() {
  const params = useParams()
  const id = params.id as string
  const { data: vitalTypes, isLoading, error } = useVitalTypes()

  if (isLoading) {
    return (
      <Container>
        <LoadingState message="Loading vital type..." />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorState 
          title="Error loading vital type"
          description="There was an error loading the vital type data."
        />
      </Container>
    )
  }

  const vitalType = vitalTypes?.find((vt: any) => vt.id === parseInt(id))

  if (!vitalType) {
    return (
      <Container>
        <ErrorState 
          title="Vital type not found"
          description="The requested vital type could not be found."
        />
      </Container>
    )
  }

  const initialValues = {
    id: vitalType.id,
    name: vitalType.name || "",
    providerName: vitalType.providerName || "",
    isActive: vitalType.isActive || true,
  }

  return (
    <Container>
      <VitalTypeForm mode="edit" initialValues={initialValues} />
    </Container>
  )
}