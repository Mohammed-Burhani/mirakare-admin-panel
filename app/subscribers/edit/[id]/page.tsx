"use client"

import { useParams } from "next/navigation"
import Container from "@/components/layout/container"
import { SubscriberForm } from "@/components/subscriber-form"
import { useSubscribers } from "@/lib/hooks/useSubscribers"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"

export default function EditSubscriberPage() {
  const params = useParams()
  const id = params.id as string
  const { data: subscribers, isLoading, error } = useSubscribers()

  if (isLoading) {
    return (
      <Container>
        <LoadingState message="Loading subscriber..." />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorState 
          title="Error loading subscriber"
          description="There was an error loading the subscriber data."
        />
      </Container>
    )
  }

  const subscriber = subscribers?.find((sub: any) => sub.id === parseInt(id))

  if (!subscriber) {
    return (
      <Container>
        <ErrorState 
          title="Subscriber not found"
          description="The requested subscriber could not be found."
        />
      </Container>
    )
  }

  const initialValues = {
    id: subscriber.id,
    subscriberType: subscriber.subscriberType || "organization",
    organizationName: subscriber.organizationName || "",
    organizationNumber: subscriber.organizationNumber || "",
    primaryContactFirstName: subscriber.primaryContactFirstName || "",
    primaryContactMiddleName: subscriber.primaryContactMiddleName || "",
    primaryContactLastName: subscriber.primaryContactLastName || "",
    primaryContactMobile: subscriber.primaryContactMobile || "",
    primaryEmail: subscriber.primaryEmail || "",
    addressLine1: subscriber.addressLine1 || "",
    addressLine2: subscriber.addressLine2 || "",
    city: subscriber.city || "",
    state: subscriber.state || "",
    zipcode: subscriber.zipcode || "",
    country: subscriber.country || "United States",
    websiteUrl: subscriber.websiteUrl || "",
    pricePlan: subscriber.pricePlan || "",
    createOrgAdmin: subscriber.createOrgAdmin || false,
    notes: subscriber.notes || "",
  }

  return (
    <Container>
      <SubscriberForm mode="edit" initialValues={initialValues} />
    </Container>
  )
}