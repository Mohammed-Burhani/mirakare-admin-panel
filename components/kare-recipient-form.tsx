"use client"

import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  FormSectionAccordion,
  FormSectionCard,
} from "@/components/form-section-accordion"
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconX,
  IconUser,
  IconPhone,
  IconMapPin,
  IconNotes,
  IconHeart,
  IconPill,
  IconAddressBook,
  IconCalendar,
  IconStar,
} from "@tabler/icons-react"
import { RichTextEditor } from "@/components/rich-text-editor"
import { useKareRecipients } from "@/lib/hooks/useKareRecipients"
import { toast } from "sonner"

// Validation Schema
const validationSchema = Yup.object({
  relationship: Yup.string().required("Relationship is required"),
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  middleName: Yup.string(),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  gender: Yup.string().required("Gender is required"),
  age: Yup.number()
    .required("Age is required")
    .positive("Age must be positive")
    .integer("Age must be a whole number"),
  email: Yup.string().email("Invalid email address"),
  phone: Yup.string().matches(/^[0-9]{10}$/, "Phone must be 10 digits"),
  addressLine1: Yup.string(),
  addressLine2: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
  zipCode: Yup.string().matches(/^[0-9]{5}$/, "Zip code must be 5 digits"),
  country: Yup.string(),
  notes: Yup.string(),
  about: Yup.string(),
  routines: Yup.string(),
  preferences: Yup.string(),
  medications: Yup.string(),
  contacts: Yup.string(),
})

interface KareRecipientFormProps {
  mode: "add" | "edit"
  initialValues?: {
    relationship: string
    firstName: string
    middleName: string
    lastName: string
    gender: string
    age: string
    email: string
    phone: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zipCode: string
    country: string
    notes: string
    about: string
    routines: string
    preferences: string
    medications: string
    contacts: string
  }
}

const defaultValues = {
  relationship: "",
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  age: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "United States",
  notes: "",
  about: "",
  routines: "",
  preferences: "",
  medications: "",
  contacts: "",
}

export function KareRecipientForm({
  mode,
  initialValues,
}: KareRecipientFormProps) {
  const router = useRouter()
  const { createKareRecipient, updateKareRecipient } = useKareRecipients()

  const handleSubmit = async (values: typeof defaultValues) => {
    try {
      if (mode === "add") {
        const recipientData = {
          id: 0,
          subscriberId: 0,
          fname: values.firstName,
          mname: values.middleName || "",
          lname: values.lastName,
          gender: values.gender,
          age: parseInt(values.age) || 0,
          email: values.email || "",
          phone: values.phone || "",
          address1: values.addressLine1 || "",
          address2: values.addressLine2 || "",
          city: values.city || "",
          state: values.state || "",
          zipcode: values.zipCode || "",
          country: values.country || "United States",
          notes: values.notes || "",
          profileImage: "",
          relationship: 0,
          about: values.about || "",
          routines: values.routines || "",
          preferences: values.preferences || "",
          medications: values.medications || "",
          contacts: values.contacts || ""
        }
        await createKareRecipient.mutateAsync(recipientData)
        toast.success("Kare Recipient created successfully")
      } else {
        const id = (initialValues as any)?.id
        if (id) {
          const recipientData = {
            subscriberId: 0,
            fname: values.firstName,
            mname: values.middleName || "",
            lname: values.lastName,
            gender: values.gender,
            age: parseInt(values.age) || 0,
            email: values.email || "",
            phone: values.phone || "",
            address1: values.addressLine1 || "",
            address2: values.addressLine2 || "",
            city: values.city || "",
            state: values.state || "",
            zipcode: values.zipCode || "",
            country: values.country || "United States",
            notes: values.notes || "",
            profileImage: "",
            relationship: 0,
            about: values.about || "",
            routines: values.routines || "",
            preferences: values.preferences || "",
            medications: values.medications || "",
            contacts: values.contacts || ""
          }
          await updateKareRecipient.mutateAsync({ id: parseInt(id), ...recipientData })
          toast.success("Kare Recipient updated successfully")
        }
      }
      router.push("/kare-recipients")
    } catch (error) {
      toast.error(`Failed to ${mode === "add" ? "create" : "update"} Kare Recipient`)
      console.error("Form submission error:", error)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="h-9 w-9"
        >
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {mode === "add"
              ? "Add New Recipient Profile"
              : "Edit Recipient Profile"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "add"
              ? "Create a new care recipient profile"
              : "Update recipient information"}
          </p>
        </div>
      </div>

      <Formik
        initialValues={initialValues || defaultValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, dirty, resetForm }) => (
          <Form className="space-y-6">
            {/* Profile Information Card - Always Visible */}
            <FormSectionCard
              title="Profile Information"
              icon={IconUser}
              description="Basic recipient details (* Required fields)"
            >
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="relationship">
                    Relationship with All BT{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Field
                    as="select"
                    name="relationship"
                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select Relationship</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Child">Child</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Other">Other</option>
                  </Field>
                  <ErrorMessage
                    name="relationship"
                    component="p"
                    className="text-destructive text-sm"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="p"
                      className="text-destructive text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Field
                      name="middleName"
                      type="text"
                      placeholder="Middle Name"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="p"
                      className="text-destructive text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gender">
                      Gender <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      as="select"
                      name="gender"
                      className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="p"
                      className="text-destructive text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">
                      Age <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      name="age"
                      type="number"
                      placeholder="Age"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <ErrorMessage
                      name="age"
                      component="p"
                      className="text-destructive text-sm"
                    />
                  </div>
                </div>
              </div>
            </FormSectionCard>

            {/* Collapsible Sections */}
            <FormSectionAccordion
              sections={[
                {
                  id: "contact",
                  title: "Contact Information",
                  icon: IconPhone,
                  description: "Email and phone details",
                  defaultOpen: true,
                  content: (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Field
                          name="email"
                          type="email"
                          placeholder="Email Address"
                          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <ErrorMessage
                          name="email"
                          component="p"
                          className="text-destructive text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone No.</Label>
                        <Field
                          name="phone"
                          type="text"
                          placeholder="Phone Number"
                          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <ErrorMessage
                          name="phone"
                          component="p"
                          className="text-destructive text-sm"
                        />
                      </div>
                    </div>
                  ),
                },
                {
                  id: "address",
                  title: "Address",
                  icon: IconMapPin,
                  description: "Physical location details",
                  defaultOpen: true,
                  content: (
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="addressLine1">Address Line 1</Label>
                        <Field
                          name="addressLine1"
                          type="text"
                          placeholder="Address Line 1"
                          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="addressLine2">Address Line 2</Label>
                        <Field
                          name="addressLine2"
                          type="text"
                          placeholder="Address Line 2"
                          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Field
                            name="city"
                            type="text"
                            placeholder="City"
                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Field
                            name="state"
                            type="text"
                            placeholder="State"
                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="zipCode">Zipcode</Label>
                          <Field
                            name="zipCode"
                            type="text"
                            placeholder="Zipcode"
                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Field
                            name="country"
                            type="text"
                            placeholder="Country"
                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "notes",
                  title: "Notes",
                  icon: IconNotes,
                  description: "General notes and observations",
                  defaultOpen: false,
                  content: (
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Field
                        as="textarea"
                        name="notes"
                        placeholder="Add any additional notes..."
                        rows={4}
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  ),
                },
                {
                  id: "about",
                  title: "About",
                  icon: IconHeart,
                  description: "Personal background and history",
                  defaultOpen: false,
                  content: (
                    <Field name="about">
                      {({ field, form }: any) => (
                        <div className="space-y-2">
                          <Label htmlFor="about">About the Recipient</Label>
                          <RichTextEditor
                            value={field.value}
                            onChange={(value) => form.setFieldValue("about", value)}
                            placeholder="Share background information, interests, personality traits..."
                          />
                        </div>
                      )}
                    </Field>
                  ),
                },
                {
                  id: "routines",
                  title: "Routines",
                  icon: IconCalendar,
                  description: "Daily routines and schedules",
                  defaultOpen: false,
                  content: (
                    <Field name="routines">
                      {({ field, form }: any) => (
                        <div className="space-y-2">
                          <Label htmlFor="routines">Daily Routines</Label>
                          <RichTextEditor
                            value={field.value}
                            onChange={(value) => form.setFieldValue("routines", value)}
                            placeholder="Describe daily routines, schedules, activities..."
                          />
                        </div>
                      )}
                    </Field>
                  ),
                },
                {
                  id: "preferences",
                  title: "Preferences",
                  icon: IconStar,
                  description: "Likes, dislikes, and preferences",
                  defaultOpen: false,
                  content: (
                    <Field name="preferences">
                      {({ field, form }: any) => (
                        <div className="space-y-2">
                          <Label htmlFor="preferences">Preferences</Label>
                          <RichTextEditor
                            value={field.value}
                            onChange={(value) => form.setFieldValue("preferences", value)}
                            placeholder="List preferences, likes, dislikes, comfort needs..."
                          />
                        </div>
                      )}
                    </Field>
                  ),
                },
                {
                  id: "medications",
                  title: "Medications",
                  icon: IconPill,
                  description: "Current medications and prescriptions",
                  defaultOpen: false,
                  content: (
                    <Field name="medications">
                      {({ field, form }: any) => (
                        <div className="space-y-2">
                          <Label htmlFor="medications">Medications</Label>
                          <RichTextEditor
                            value={field.value}
                            onChange={(value) => form.setFieldValue("medications", value)}
                            placeholder="List medications, dosages, schedules, allergies..."
                          />
                        </div>
                      )}
                    </Field>
                  ),
                },
                {
                  id: "contacts",
                  title: "Contacts",
                  icon: IconAddressBook,
                  description: "Emergency and important contacts",
                  defaultOpen: false,
                  content: (
                    <Field name="contacts">
                      {({ field, form }: any) => (
                        <div className="space-y-2">
                          <Label htmlFor="contacts">Emergency Contacts</Label>
                          <RichTextEditor
                            value={field.value}
                            onChange={(value) => form.setFieldValue("contacts", value)}
                            placeholder="List emergency contacts, doctors, family members..."
                          />
                        </div>
                      )}
                    </Field>
                  ),
                },
              ]}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm()
                  router.back()
                }}
                className="gap-2"
              >
                <IconX className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => resetForm()}
                disabled={!dirty}
                className="gap-2"
              >
                Clear
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || createKareRecipient.isPending || updateKareRecipient.isPending} 
                className="gap-2"
              >
                <IconDeviceFloppy className="h-4 w-4" />
                {mode === "add" ? "Add" : "Save Changes"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
