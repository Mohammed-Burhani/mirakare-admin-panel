"use client"

import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconX,
  IconUser,
  IconPhone,
  IconMail,
  IconMapPin,
} from "@tabler/icons-react"

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
  addressLine1: Yup.string().required("Address line 1 is required"),
  addressLine2: Yup.string(),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipCode: Yup.string()
    .required("Zip code is required")
    .matches(/^[0-9]{5}$/, "Zip code must be 5 digits"),
  country: Yup.string().required("Country is required"),
  notes: Yup.string(),
})

interface KareAdminFormProps {
  mode: "add" | "edit"
  initialValues?: {
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

export function KareAdminForm({ mode, initialValues }: KareAdminFormProps) {
  const router = useRouter()

  const handleSubmit = (values: typeof defaultValues) => {
    console.log("Form submitted:", values)
    // Add your submit logic here
    router.push("/kare-admins")
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
          <Form>
            <Card className="border-2">
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <IconUser className="text-primary h-5 w-5" />
                  Account Information
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  * Required fields
                </p>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {/* Personal Information */}
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    <IconUser className="text-primary h-5 w-5" />
                    Personal Information
                  </h3>
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
                </div>

                <Separator />

                {/* Contact Information */}
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    <IconPhone className="text-primary h-5 w-5" />
                    Contact Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="flex items-center gap-2">
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
                      <Label htmlFor="email" className="flex items-center gap-2">
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
                </div>

                <Separator />

                {/* Address */}
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    <IconMapPin className="text-primary h-5 w-5" />
                    Address
                  </h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="addressLine1">
                        Address Line 1 <span className="text-destructive">*</span>
                      </Label>
                      <Field
                        name="addressLine1"
                        type="text"
                        placeholder="Address Line 1"
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <ErrorMessage
                        name="addressLine1"
                        component="p"
                        className="text-destructive text-sm"
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
                        <Label htmlFor="city">
                          City <span className="text-destructive">*</span>
                        </Label>
                        <Field
                          name="city"
                          type="text"
                          placeholder="City"
                          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <ErrorMessage
                          name="city"
                          component="p"
                          className="text-destructive text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">
                          State <span className="text-destructive">*</span>
                        </Label>
                        <Field
                          name="state"
                          type="text"
                          placeholder="State"
                          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <ErrorMessage
                          name="state"
                          component="p"
                          className="text-destructive text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode">
                          Zipcode <span className="text-destructive">*</span>
                        </Label>
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
                        <Label htmlFor="country">
                          Country <span className="text-destructive">*</span>
                        </Label>
                        <Field
                          name="country"
                          type="text"
                          placeholder="Country"
                          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <ErrorMessage
                          name="country"
                          component="p"
                          className="text-destructive text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Notes */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Notes</h3>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Information</Label>
                    <Field
                      as="textarea"
                      name="notes"
                      placeholder="Add any additional notes or information..."
                      rows={4}
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 border-t pt-6">
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
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    <IconDeviceFloppy className="h-4 w-4" />
                    {mode === "add" ? "Add" : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Form>
        )}
      </Formik>
    </div>
  )
}
