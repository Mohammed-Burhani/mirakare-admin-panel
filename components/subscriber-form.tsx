"use client"

import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconX,
  IconBuilding,
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconWorld,
  IconCreditCard,
  IconNotes,
  IconUserPlus,
} from "@tabler/icons-react"
import { useSubscribers, SUBSCRIBER_TYPES, PRICE_PLANS } from "@/lib/hooks/useSubscribers"
import { toast } from "sonner"

// Validation Schema
const validationSchema = Yup.object({
  subscriberType: Yup.string().required("Subscriber type is required"),
  organizationName: Yup.string()
    .required("Organization name is required")
    .min(2, "Organization name must be at least 2 characters"),
  organizationNumber: Yup.string(),
  primaryContactFirstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  primaryContactMiddleName: Yup.string(),
  primaryContactLastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  primaryContactMobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9-+\s()]+$/, "Invalid mobile number format"),
  primaryEmail: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  addressLine1: Yup.string().required("Address line 1 is required"),
  addressLine2: Yup.string(),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipcode: Yup.string()
    .required("Zipcode is required")
    .matches(/^[0-9]{5}(-[0-9]{4})?$/, "Invalid zipcode format"),
  country: Yup.string().required("Country is required"),
  websiteUrl: Yup.string().url("Invalid URL format"),
  pricePlan: Yup.string().required("Price plan is required"),
  createOrgAdmin: Yup.boolean(),
  notes: Yup.string(),
})

interface SubscriberFormProps {
  mode: "add" | "edit"
  initialValues?: {
    id?: number
    subscriberType: string
    organizationName: string
    organizationNumber: string
    primaryContactFirstName: string
    primaryContactMiddleName: string
    primaryContactLastName: string
    primaryContactMobile: string
    primaryEmail: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zipcode: string
    country: string
    websiteUrl: string
    pricePlan: string
    createOrgAdmin: boolean
    notes: string
  }
}

const defaultValues = {
  subscriberType: "organization",
  organizationName: "",
  organizationNumber: "",
  primaryContactFirstName: "",
  primaryContactMiddleName: "",
  primaryContactLastName: "",
  primaryContactMobile: "",
  primaryEmail: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipcode: "",
  country: "United States",
  websiteUrl: "",
  pricePlan: "",
  createOrgAdmin: false,
  notes: "",
}

export function SubscriberForm({ mode, initialValues }: SubscriberFormProps) {
  const router = useRouter()
  const { createSubscriber, updateSubscriber } = useSubscribers()

  const handleSubmit = async (values: typeof defaultValues) => {
    try {
      if (mode === "add") {
        await createSubscriber.mutateAsync(values)
        toast.success("Subscriber registered successfully")
      } else {
        const id = (initialValues as any)?.id
        if (id) {
          await updateSubscriber.mutateAsync({ id: parseInt(id), ...values })
          toast.success("Subscriber updated successfully")
        }
      }
      router.push("/subscribers")
    } catch (error) {
      toast.error(`Failed to ${mode === "add" ? "register" : "update"} subscriber`)
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
            {mode === "add" ? "Register New Subscriber Account" : "Edit Subscriber Account"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "add"
              ? "Create a new subscriber organization or family account"
              : "Update subscriber information and settings"}
          </p>
        </div>
      </div>

      <Formik
        initialValues={initialValues || defaultValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, dirty, resetForm, values, setFieldValue }) => (
          <Form className="flex flex-col gap-6">
            {/* Subscriber Type & Organization Info */}
            <Card className="border-2 border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <IconBuilding className="h-5 w-5 text-primary" />
                  <CardTitle>Organization Information</CardTitle>
                </div>
                <CardDescription>
                  Basic organization details and subscriber type (* Required fields)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subscriberType">
                    Subscriber Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={values.subscriberType}
                    onValueChange={(value) => setFieldValue("subscriberType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subscriber type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBSCRIBER_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="subscriberType"
                    component="p"
                    className="text-destructive text-sm"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">
                      Organization Name <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      name="organizationName"
                      type="text"
                      placeholder="Enter organization name"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <ErrorMessage
                      name="organizationName"
                      component="p"
                      className="text-destructive text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationNumber">Organization Number</Label>
                    <Field
                      name="organizationNumber"
                      type="text"
                      placeholder="Enter organization number"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Primary Contact Person */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <IconUser className="h-5 w-5 text-primary" />
                  <CardTitle>Primary Contact Person</CardTitle>
                </div>
                <CardDescription>
                  Main contact person for this subscriber account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="primaryContactFirstName">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      name="primaryContactFirstName"
                      type="text"
                      placeholder="First Name"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <ErrorMessage
                      name="primaryContactFirstName"
                      component="p"
                      className="text-destructive text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryContactMiddleName">Middle Name</Label>
                    <Field
                      name="primaryContactMiddleName"
                      type="text"
                      placeholder="Middle Name"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryContactLastName">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      name="primaryContactLastName"
                      type="text"
                      placeholder="Last Name"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <ErrorMessage
                      name="primaryContactLastName"
                      component="p"
                      className="text-destructive text-sm"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primaryContactMobile" className="flex items-center gap-2">
                      <IconPhone className="h-4 w-4" />
                      Primary Contact Mobile No. <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      name="primaryContactMobile"
                      type="text"
                      placeholder="Mobile number"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <ErrorMessage
                      name="primaryContactMobile"
                      component="p"
                      className="text-destructive text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryEmail" className="flex items-center gap-2">
                      <IconMail className="h-4 w-4" />
                      Primary Email <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      name="primaryEmail"
                      type="email"
                      placeholder="Email address"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <ErrorMessage
                      name="primaryEmail"
                      component="p"
                      className="text-destructive text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <IconMapPin className="h-5 w-5 text-primary" />
                  <CardTitle>Address</CardTitle>
                </div>
                <CardDescription>
                  Physical location and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <Label htmlFor="zipcode">
                      Zipcode <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      name="zipcode"
                      type="text"
                      placeholder="Zipcode"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <ErrorMessage
                      name="zipcode"
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
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <IconWorld className="h-5 w-5 text-primary" />
                  <CardTitle>Additional Information</CardTitle>
                </div>
                <CardDescription>
                  Website, pricing, and other details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl" className="flex items-center gap-2">
                    <IconWorld className="h-4 w-4" />
                    Website URL
                  </Label>
                  <Field
                    name="websiteUrl"
                    type="url"
                    placeholder="https://example.com"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <ErrorMessage
                    name="websiteUrl"
                    component="p"
                    className="text-destructive text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePlan" className="flex items-center gap-2">
                    <IconCreditCard className="h-4 w-4" />
                    Price Plan <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={values.pricePlan}
                    onValueChange={(value) => setFieldValue("pricePlan", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select price plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICE_PLANS.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="pricePlan"
                    component="p"
                    className="text-destructive text-sm"
                  />
                </div>

                <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
                  <Checkbox
                    id="createOrgAdmin"
                    checked={values.createOrgAdmin}
                    onCheckedChange={(checked) => setFieldValue("createOrgAdmin", checked)}
                  />
                  <Label htmlFor="createOrgAdmin" className="flex items-center gap-2 cursor-pointer">
                    <IconUserPlus className="h-4 w-4" />
                    Create Organization Admin with the same details as Primary contact person
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <IconNotes className="h-5 w-5 text-primary" />
                  <CardTitle>Notes</CardTitle>
                </div>
                <CardDescription>
                  Additional information and comments
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
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
                disabled={isSubmitting || createSubscriber.isPending || updateSubscriber.isPending} 
                className="gap-2"
              >
                <IconDeviceFloppy className="h-4 w-4" />
                {mode === "add" ? "Register" : "Save Changes"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}