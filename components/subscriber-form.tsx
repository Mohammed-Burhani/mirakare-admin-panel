"use client"

import { useRouter } from "next/navigation"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import {
  IconBuilding,
  IconUser,
  IconMapPin,
  IconWorld,
  IconNotes,
  IconUserPlus,
} from "@tabler/icons-react"
import { useSubscribers, useSubscriber, SUBSCRIBER_TYPES } from "@/lib/hooks/useSubscribers"
import { useActivePackages } from "@/lib/hooks/usePackages"
import { CreateSubscriberRequest, UpdateSubscriberRequest } from "@/lib/api/types"
import { toast } from "sonner"
import { FormHeader } from "@/components/form/form-header"
import { FormSection } from "@/components/form/form-section"
import { FormField, FormSelect, FormSwitch, FormTextarea } from "@/components/form/form-field"
import { FormActions } from "@/components/form/form-actions"

// Validation Schema
const validationSchema = Yup.object({
  fname: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lname: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  type: Yup.string().required("Subscriber type is required"),
  contactPersonFName: Yup.string()
    .required("Contact person first name is required"),
  contactPersonLName: Yup.string()
    .required("Contact person last name is required"),
  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9-+\s()]+$/, "Invalid mobile number format"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  address1: Yup.string().required("Address line 1 is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipcode: Yup.string()
    .required("Zipcode is required")
    .matches(/^[0-9]{5}(-[0-9]{4})?$/, "Invalid zipcode format"),
  country: Yup.string().required("Country is required"),
  pricePlanType: Yup.number().required("Price plan is required"),
  websiteUrl: Yup.string().url("Invalid URL format"),
})

interface SubscriberFormProps {
  mode: "add" | "edit"
  id?: number
}

const defaultValues = {
  fname: "",
  mname: "",
  lname: "",
  type: "organization",
  contactPersonFName: "",
  contactPersonMName: "",
  contactPersonLName: "",
  mobile: "",
  orgPhone: "",
  email: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zipcode: "",
  country: "United States",
  websiteUrl: "",
  pricePlanType: 1,
  sameAsSub: true,
  userfname: "",
  usermname: "",
  userlname: "",
  usermobile: "",
  useremail: "",
  useraddress1: "",
  useraddress2: "",
  usercity: "",
  userstate: "",
  userzipcode: "",
  usercountry: "",
  usernotes: "",
  notes: "",
}

export function SubscriberForm({ mode, id }: SubscriberFormProps) {
  const router = useRouter()
  const { createSubscriber, updateSubscriber } = useSubscribers()
  const { data: subscriber, isLoading } = useSubscriber(id || 0)
  const { data: packages = [], isLoading: packagesLoading } = useActivePackages()

  // Convert packages to dropdown format
  const packageOptions = packages.map(pkg => ({
    id: pkg.id,
    name: `${pkg.name} (${pkg.durationInMonths} months) - ${pkg.type}`
  }))

  // For edit mode, we need to handle the simplified subscriber data
  // Since the API returns simplified data but expects complex data for updates,
  // we'll use default values for edit mode and let user fill in the details
  const initialValues = mode === "edit" && subscriber ? {
    ...defaultValues,
    // Map the available fields from the simplified subscriber response
    type: subscriber.type.toLowerCase(),
    mobile: subscriber.mobile,
    orgPhone: subscriber.orgPhone || "",
    email: subscriber.email,
    // Parse name if it's in "FirstName LastName" format
    fname: subscriber.name.split(' ')[0] || "",
    lname: subscriber.name.split(' ').slice(1).join(' ') || "",
    // Parse address if available
    address1: subscriber.address || "",
  } : defaultValues

  const handleSubmit = async (values: typeof defaultValues) => {
    try {
      if (mode === "add") {
        const payload: CreateSubscriberRequest = {
          id: 0, // API will assign ID
          ...values,
        }
        await createSubscriber.mutateAsync(payload)
        toast.success("Subscriber registered successfully")
      } else if (mode === "edit" && id) {
        const payload: UpdateSubscriberRequest = {
          id: id,
          ...values,
        }
        await updateSubscriber.mutateAsync(payload)
        toast.success("Subscriber updated successfully")
      }
      router.push("/subscribers")
    } catch (error) {
      toast.error(`Failed to ${mode === "add" ? "register" : "update"} subscriber`)
      console.error("Form submission error:", error)
    }
  }

  if (mode === "edit" && isLoading) {
    return <div>Loading...</div>
  }

  if (packagesLoading) {
    return <div>Loading packages...</div>
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      <FormHeader
        title={mode === "add" ? "Register New Subscriber Account" : "Edit Subscriber Account"}
        description={mode === "add" ? "Create a new subscriber organization or family account" : "Update subscriber information and settings"}
        onBack={() => router.back()}
      />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values }) => (
          <Form className="flex flex-col gap-6">
            {/* Organization Information */}
            <FormSection
              title="Organization Information"
              description="Basic organization details and subscriber type (* Required fields)"
              icon={<IconBuilding className="h-5 w-5 text-primary" />}
              highlight
            >
              <FormSelect
                name="type"
                label="Subscriber Type"
                placeholder="Select subscriber type"
                options={SUBSCRIBER_TYPES}
                required
              />

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  name="fname"
                  label="Organization First Name"
                  placeholder="Enter first name"
                  required
                />
                <FormField
                  name="mname"
                  label="Middle Name"
                  placeholder="Enter middle name"
                />
                <FormField
                  name="lname"
                  label="Organization Last Name"
                  placeholder="Enter last name"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  name="mobile"
                  label="Mobile Number"
                  placeholder="Enter mobile number"
                  required
                />
                <FormField
                  name="orgPhone"
                  label="Organization Phone"
                  placeholder="Enter organization phone"
                />
              </div>

              <FormField
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                required
              />
            </FormSection>

            {/* Contact Person Information */}
            <FormSection
              title="Primary Contact Person"
              description="Main contact person for this subscriber account"
              icon={<IconUser className="h-5 w-5 text-primary" />}
            >
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  name="contactPersonFName"
                  label="First Name"
                  placeholder="Contact first name"
                  required
                />
                <FormField
                  name="contactPersonMName"
                  label="Middle Name"
                  placeholder="Contact middle name"
                />
                <FormField
                  name="contactPersonLName"
                  label="Last Name"
                  placeholder="Contact last name"
                  required
                />
              </div>
            </FormSection>

            {/* Address Information */}
            <FormSection
              title="Address Information"
              description="Physical location and contact details"
              icon={<IconMapPin className="h-5 w-5 text-primary" />}
            >
              <FormField
                name="address1"
                label="Address Line 1"
                placeholder="Enter address line 1"
                required
              />
              <FormField
                name="address2"
                label="Address Line 2"
                placeholder="Enter address line 2"
              />

              <div className="grid gap-4 md:grid-cols-4">
                <FormField
                  name="city"
                  label="City"
                  placeholder="Enter city"
                  required
                />
                <FormField
                  name="state"
                  label="State"
                  placeholder="Enter state"
                  required
                />
                <FormField
                  name="zipcode"
                  label="Zipcode"
                  placeholder="Enter zipcode"
                  required
                />
                <FormField
                  name="country"
                  label="Country"
                  placeholder="Enter country"
                  required
                />
              </div>
            </FormSection>

            {/* Additional Information */}
            <FormSection
              title="Additional Information"
              description="Website, pricing, and other details"
              icon={<IconWorld className="h-5 w-5 text-primary" />}
            >
              <FormField
                name="websiteUrl"
                label="Website URL"
                type="url"
                placeholder="https://example.com"
              />

              <FormSelect
                name="pricePlanType"
                label="Price Plan"
                placeholder="Select price plan"
                options={packageOptions}
                required
              />

              <FormSwitch
                name="sameAsSub"
                label="Same as Subscriber"
                description="Use the same details for organization admin"
              />
            </FormSection>

            {/* User Admin Information */}
            {!values.sameAsSub && (
              <FormSection
                title="Organization Admin Information"
                description="Details for the organization admin user"
                icon={<IconUserPlus className="h-5 w-5 text-primary" />}
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    name="userfname"
                    label="Admin First Name"
                    placeholder="Enter admin first name"
                  />
                  <FormField
                    name="usermname"
                    label="Admin Middle Name"
                    placeholder="Enter admin middle name"
                  />
                  <FormField
                    name="userlname"
                    label="Admin Last Name"
                    placeholder="Enter admin last name"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    name="usermobile"
                    label="Admin Mobile"
                    placeholder="Enter admin mobile"
                  />
                  <FormField
                    name="useremail"
                    label="Admin Email"
                    type="email"
                    placeholder="Enter admin email"
                  />
                </div>

                <FormField
                  name="useraddress1"
                  label="Admin Address Line 1"
                  placeholder="Enter admin address line 1"
                />
                <FormField
                  name="useraddress2"
                  label="Admin Address Line 2"
                  placeholder="Enter admin address line 2"
                />

                <div className="grid gap-4 md:grid-cols-4">
                  <FormField
                    name="usercity"
                    label="Admin City"
                    placeholder="Enter admin city"
                  />
                  <FormField
                    name="userstate"
                    label="Admin State"
                    placeholder="Enter admin state"
                  />
                  <FormField
                    name="userzipcode"
                    label="Admin Zipcode"
                    placeholder="Enter admin zipcode"
                  />
                  <FormField
                    name="usercountry"
                    label="Admin Country"
                    placeholder="Enter admin country"
                  />
                </div>

                <FormField
                  name="usernotes"
                  label="Admin Notes"
                  placeholder="Enter admin notes"
                />
              </FormSection>
            )}

            {/* Notes */}
            <FormSection
              title="Notes"
              description="Additional information and comments"
              icon={<IconNotes className="h-5 w-5 text-primary" />}
            >
              <FormTextarea
                name="notes"
                label="Additional Information"
                placeholder="Add any additional notes or information..."
                rows={4}
              />
            </FormSection>

            <FormActions
              mode={mode}
              onCancel={() => router.back()}
              isSubmitting={isSubmitting || createSubscriber.isPending || updateSubscriber.isPending}
              submitLabel={mode === "add" ? "Register" : "Save Changes"}
            />
          </Form>
        )}
      </Formik>
    </div>
  )
}