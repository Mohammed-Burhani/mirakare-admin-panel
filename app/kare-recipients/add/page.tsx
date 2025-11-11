import Container from "@/components/layout/container"
import { KareRecipientForm } from "@/components/kare-recipient-form"

export default function AddKareRecipientPage() {
  return (
    <Container>
      <KareRecipientForm mode="add" />
    </Container>
  )
}
