"use client"

import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { useOrganizationProfile, useUpdateOrganizationProfile } from "@/lib/hooks/useOrganizationProfile"
import { OrganizationProfileUpdateRequest } from "@/lib/api/types"
import { toast } from "sonner"
import { 
  IconBuilding, 
  IconUser, 
  IconMail, 
  IconMapPin, 
  IconGlobe, 
  IconDeviceFloppy, 
  IconX,
  IconEdit
} from "@tabler/icons-react"
import { FormSection } from "@/components/form/form-section"

// =============================================================================
// VALIDATION SCHEMA
// =============================================================================

const validationSchema = Yup.object({
  fname: Yup.string()
    .required("Organization name is required")
    .min(2, "Organization name must be at least 2 characters"),
  mname: Yup.string(),
  lname: Yup.string(),
  contactPersonFName: Yup.string()
    .required("Contact person first name is required")
    .min(2, "First name must be at least 2 characters"),
  contactPersonMName: Yup.string(),
  contactPersonLName: Yup.string()
    .required("Contact person last name is required")
    .min(2, "Last name must be at least 2 characters"),
  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9-+\s()]+$/, "Invalid mobile number format"),
  orgPhone: Yup.string()
    .matches(/^[0-9-+\s()]*$/, "Invalid phone number format"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  address1: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
  address2: Yup.string(),
  city: Yup.string()
    .required("City is required")
    .min(2, "City must be at least 2 characters"),
  state: Yup.string()
    .required("State is required")
    .min(2, "State must be at least 2 characters"),
  zipcode: Yup.string()
    .required("Zipcode is required")
    .matches(/^[0-9]{5}(-[0-9]{4})?$/, "Invalid zipcode format"),
  country: Yup.string()
    .required("Country is required")
    .min(2, "Country must be at least 2 characters"),
  websiteUrl: Yup.string()
    .url("Invalid URL format"),
  notes: Yup.string(),
})

// =============================================================================
// CUSTOM FORM FIELD COMPONENTS
// =============================================================================

interface CustomFormFieldProps {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  rows?: number
  as?: string
}

function CustomFormField({ 
  name, 
  label, 
  type = "text", 
  placeholder, 
  required = false, 
  disabled = false,
  rows,
  as
}: CustomFormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Field
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        as={as}
        className={`border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex ${as === 'textarea' ? 'min-h-[80px]' : 'h-10'} w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
      />
      <ErrorMessage
        name={name}
        component="p"
        className="text-destructive text-sm"
      />
    </div>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

export function OrganizationProfileForm() {
  const [isEditing, setIsEditing] = useState(false)
  const { data: profile, isLoading, error } = useOrganizationProfile()
  const updateProfile = useUpdateOrganizationProfile()

  if (isLoading) {
    return <LoadingState message="Loading organization profile..." />
  }

  if (error) {
    return <ErrorState message="Failed to load organization profile" />
  }

  if (!profile) {
    return <ErrorState message="Organization profile not found" />
  }

  const initialValues = {
    fname: profile.fname || "",
    mname: profile.mname || "",
    lname: profile.lname || "",
    type: profile.type || "Organization",
    contactPersonFName: profile.contactPersonFName || "",
    contactPersonMName: profile.contactPersonMName || "",
    contactPersonLName: profile.contactPersonLName || "",
    mobile: profile.mobile || "",
    orgPhone: profile.orgPhone || "",
    email: profile.email || "",
    address1: profile.address1 || "",
    address2: profile.address2 || "",
    city: profile.city || "",
    state: profile.state || "",
    zipcode: profile.zipcode || "",
    country: profile.country || "",
    websiteUrl: profile.websiteUrl || "",
    notes: profile.notes || "",
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const updateData: OrganizationProfileUpdateRequest = {
        ...profile,
        ...values,
      }

      await updateProfile.mutateAsync(updateData)
      toast.success("Organization profile updated successfully")
      setIsEditing(false)
    } catch (error) {
      toast.error("Failed to update organization profile")
      console.error("Failed to update profile:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconBuilding className="h-5 w-5" />
              Organization Profile
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="text-destructive">*</span> Required fields
            </p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <IconEdit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ resetForm }) => (
            <Form className="space-y-6">
              {/* Organization Information */}
              <FormSection
                title="Organization Information"
                icon={<IconBuilding className="h-5 w-5" />}
              >
                <div className="grid gap-4">
                  <CustomFormField
                    name="fname"
                    label="Organization Name"
                    placeholder="Enter organization name"
                    required
                    disabled={!isEditing}
                  />

                  <CustomFormField
                    name="mname"
                    label="Organization Number"
                    placeholder="Enter organization number"
                    disabled={!isEditing}
                  />
                </div>
              </FormSection>

              {/* Primary Contact Person */}
              <FormSection
                title="Primary Contact Person"
                icon={<IconUser className="h-5 w-5" />}
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <CustomFormField
                    name="contactPersonFName"
                    label="First Name"
                    placeholder="First name"
                    required
                    disabled={!isEditing}
                  />

                  <CustomFormField
                    name="contactPersonMName"
                    label="Middle Name"
                    placeholder="Middle name"
                    disabled={!isEditing}
                  />

                  <CustomFormField
                    name="contactPersonLName"
                    label="Last Name"
                    placeholder="Last name"
                    required
                    disabled={!isEditing}
                  />
                </div>

                <CustomFormField
                  name="mobile"
                  label="Primary Contact Mobile No."
                  placeholder="Enter mobile number"
                  required
                  disabled={!isEditing}
                />
              </FormSection>

              {/* Contact Information */}
              <FormSection
                title="Contact Information"
                icon={<IconMail className="h-5 w-5" />}
              >
                <CustomFormField
                  name="email"
                  label="Organization Email"
                  type="email"
                  placeholder="Enter email address"
                  required
                  disabled={!isEditing}
                />

                <CustomFormField
                  name="orgPhone"
                  label="Organization Phone"
                  placeholder="Enter organization phone"
                  disabled={!isEditing}
                />
              </FormSection>

              {/* Address Information */}
              <FormSection
                title="Address"
                icon={<IconMapPin className="h-5 w-5" />}
              >
                <CustomFormField
                  name="address1"
                  label="Address Line 1"
                  placeholder="Enter address line 1"
                  required
                  disabled={!isEditing}
                />

                <CustomFormField
                  name="address2"
                  label="Address Line 2"
                  placeholder="Enter address line 2"
                  disabled={!isEditing}
                />

                <div className="grid gap-4 md:grid-cols-4">
                  <CustomFormField
                    name="city"
                    label="City"
                    placeholder="City"
                    required
                    disabled={!isEditing}
                  />

                  <CustomFormField
                    name="state"
                    label="State"
                    placeholder="State"
                    required
                    disabled={!isEditing}
                  />

                  <CustomFormField
                    name="zipcode"
                    label="Zipcode"
                    placeholder="Zipcode"
                    required
                    disabled={!isEditing}
                  />

                  <CustomFormField
                    name="country"
                    label="Country"
                    placeholder="Country"
                    required
                    disabled={!isEditing}
                  />
                </div>
              </FormSection>

              {/* Additional Information */}
              <FormSection
                title="Additional Information"
                icon={<IconGlobe className="h-5 w-5" />}
              >
                <CustomFormField
                  name="websiteUrl"
                  label="Website URL"
                  placeholder="Enter website URL"
                  disabled={!isEditing}
                />

                <CustomFormField
                  name="notes"
                  label="Notes"
                  placeholder="Enter any additional notes"
                  rows={4}
                  as="textarea"
                  disabled={!isEditing}
                />
              </FormSection>

              {/* Form Actions */}
              {isEditing && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      setIsEditing(false)
                    }}
                    className="gap-2 border-muted-foreground/30 hover:bg-muted"
                  >
                    <IconX className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updateProfile.isPending} 
                    className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <IconDeviceFloppy className="h-4 w-4" />
                    {updateProfile.isPending ? "Updating..." : "Update Profile"}
                  </Button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  )
}