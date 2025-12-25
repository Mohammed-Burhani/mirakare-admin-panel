/* eslint-disable @typescript-eslint/no-explicit-any */
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
  IconMail,
} from "@tabler/icons-react"
import { useKareAdmins } from "@/lib/hooks/useKareAdmins"
import { toast } from "sonner"

// Validation Schema
const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  middleName: Yup.string(),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
})

interface KareAdminFormProps {
  mode: "add" | "edit"
  initialValues?: {
    firstName: string
    middleName: string
    lastName: string
    mobile: string
    email: string
  }
}

const defaultValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  mobile: "",
  email: "",
}

export function KareAdminForm({ mode, initialValues }: KareAdminFormProps) {
  const router = useRouter()
  const { createKareAdmin, updateKareAdmin } = useKareAdmins()

  const handleSubmit = async (values: typeof defaultValues) => {
    try {
      if (mode === "add") {
        const adminData = {
          id: 0,
          name: `${values.firstName} ${values.middleName} ${values.lastName}`.replace(/\s+/g, ' ').trim(),
          email: values.email,
          mobile: values.mobile,
          recipientId: 0,
          relationship: 0
        }
        await createKareAdmin.mutateAsync(adminData)
        toast.success("Kare Admin created successfully")
      } else {
        const id = (initialValues as any)?.id
        if (id) {
          const adminData = {
            name: `${values.firstName} ${values.middleName} ${values.lastName}`.replace(/\s+/g, ' ').trim(),
            email: values.email,
            mobile: values.mobile,
            recipientId: 0,
            relationship: 0
          }
          await updateKareAdmin.mutateAsync({ id: parseInt(id), ...adminData })
          toast.success("Kare Admin updated successfully")
        }
      }
      router.push("/kare-admins")
    } catch (error) {
      toast.error(`Failed to ${mode === "add" ? "create" : "update"} Kare Admin`)
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
            {mode === "add" ? "Add New Kare Admin" : "Edit Kare Admin"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "add"
              ? "Create a new administrator account"
              : "Update administrator information"}
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
          <Form className="flex flex-col gap-6">
            {/* Profile Information Card - Always Visible */}
            <FormSectionCard
              title="Profile Information"
              icon={IconUser}
              description="Basic account details (* Required fields)"
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
                  title: "Contact Information",
                  icon: IconPhone,
                  description: "Email and phone details",
                  defaultOpen: true,
                  content: (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="mobile"
                          className="flex items-center gap-2"
                        >
                          <IconPhone className="h-4 w-4" />
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
                        <Label
                          htmlFor="email"
                          className="flex items-center gap-2"
                        >
                          <IconMail className="h-4 w-4" />
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
                disabled={isSubmitting || createKareAdmin.isPending || updateKareAdmin.isPending} 
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
