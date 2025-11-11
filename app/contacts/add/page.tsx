import Container from "@/components/layout/container"
import { ContactForm } from "@/components/contact-form"

export default function AddContactPage() {
  return (
    <Container>
      <ContactForm mode="add" />
    </Container>
  )
}
