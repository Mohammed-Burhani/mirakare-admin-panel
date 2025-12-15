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
  IconEye,
} from "@tabler/icons-react"
import { useKareViewers } from "@/lib/hooks/useKareViewers"
import { toast } from "sonner"

// Validation Schema
const validationSchema = Yup.object({
  recipient: Yup.string().required("Recipient is required"),
  relationship: Yup.string().required("Relationship is required"),
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  middleName: Yup.string(),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  mobile: Yup.string()
    .required("Mobile is required")
    .matches(/^[0-9]{10}$/, "Mobile must be 10 digits"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  addressLine1: Yup.string(),
  addressLine2: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
  zipCode: Yup.string().matches(/^[0-9]{5}$/, "Zip code must be 5 digits"),
  country: Yup.string(),
  notes: Yup.string(),
})

interface KareViewerFormProps {
  mode: "add" | "edit"
  initialValues?: {
    recipient: string
    relationship: string
    firstName: string
    middleName: string
    lastName: string
    mobile: string
    email: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zipCode: string
    country: string
    notes: string
  }
}

const defaultValues = {
  recipient: "",
  relationship: "",
  firstName: "",
  middleName: "",
  lastName: "",
  mobile: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "United States",
  notes: "",
}

export function KareViewerForm({ mode, initialValues }: KareViewerFormProps) {
  const router = useRouter()
  const { createKareViewer, updateKareViewer } = useKareViewers()

  const handleSubmit = async (values: typeof defaultValues) => {
    try {
      if (mode === "add") {
        await createKareViewer.mutateAsync(values)
        toast.success("Kare Viewer created successfully")
      } else {
        const id = (initialValues as any)?.id
        if (id) {
          await updateKareViewer.mutateAsync({ id: parseInt(id), ...values })
          toast.success("Kare Viewer updated successfully")
        }
      }
      router.push("/kare-viewers")
    } catch (error) {
      toast.error(`Failed to ${mode === "add" ? "create" : "update"} Kare Viewer`)
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
              ? "Add New Viewer Account"
              : "Edit Viewer Account"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "add"
              ? "Create a new viewer profile"
              : "Update viewer information"}
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
            {/* Recipient & Relationship Card - Always Visible */}
            <FormSectionCard
              title="Recipient"
              icon={IconEye}
              description="Select recipient and relationship (* Required fields)"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="recipient">
                    Recipient <span className="text-destructive">*</span>
                  </Label>
                  <Field
                    as="select"
                    name="recipient"
                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select Recipient</option>
                    <option value="Mira Sharma">Mira Sharma</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                  </Field>
                  <ErrorMessage
                    name="recipient"
                    component="p"
                    className="text-destructive text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship">
                    Relationship <span className="text-destructive">*</span>
                  </Label>
                  <Field
                    as="select"
                    name="relationship"
                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select Relationship</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Grandchild">Grandchild</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </Field>
                  <ErrorMessage
                    name="relationship"
                    component="p"
                    className="text-destructive text-sm"
                  />
                </div>
              </div>
            </FormSectionCard>

            {/* Name Information Card - Always Visible */}
            <FormSectionCard
              title="Name"
              icon={IconUser}
              description="Viewer name details (* Required fields)"
            >
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
            </FormSectionCard>

            {/* Collapsible Sections */}
            <FormSectionAccordion
              sections={[
                {
                  id: "contact",
                  title: "Mobile",
                  icon: IconPhone,
                  description: "Mobile and email details",
                  defaultOpen: true,
                  content: (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="mobile">
                          Mobile <span className="text-destructive">*</span>
                        </Label>
                        <Field
                          name="mobile"
                          type="text"
                          placeholder="Mobile Number"
                          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <ErrorMessage
                          name="mobile"
                          component="p"
                          className="text-destructive text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email <span className="text-destructive">*</span>
                        </Label>
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
                          <ErrorMessage
                            name="zipCode"
                            component="p"
                            className="text-destructive text-sm"
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
                Back
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
                disabled={isSubmitting || createKareViewer.isPending || updateKareViewer.isPending} 
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
