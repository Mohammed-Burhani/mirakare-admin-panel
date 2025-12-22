"use client"

import { useParams } from "next/navigation"
import Container from "@/components/layout/container"
import { PackageForm } from "@/components/package-form"
import { usePackages } from "@/lib/hooks/usePackages"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"

export default function EditPackagePage() {
  const params = useParams()
  const id = params.id as string
  const { data: packages, isLoading, error } = usePackages()

  if (isLoading) {
    return (
      <Container>
        <LoadingState message="Loading package..." />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorState 
          title="Error loading package"
          description="There was an error loading the package data."
        />
      </Container>
    )
  }

  const packageData = packages?.find((pkg: any) => pkg.id === parseInt(id))

  if (!packageData) {
    return (
      <Container>
        <ErrorState 
          title="Package not found"
          description="The requested package could not be found."
        />
      </Container>
    )
  }

  const initialValues = {
    id: packageData.id,
    name: packageData.name || "",
    type: packageData.type || "",
    isActive: packageData.isActive || true,
    durationInMonths: packageData.durationInMonths || 12,
    noOfKareReceivers: packageData.noOfKareReceivers || 1,
    noOfKareGivers: packageData.noOfKareGivers || 1,
    noOfKareViewers: packageData.noOfKareViewers || 1,
    price: packageData.price || 0,
    description: packageData.description || "",
    features: packageData.features || [],
  }

  return (
    <Container>
      <PackageForm mode="edit" initialValues={initialValues} />
    </Container>
  )
}