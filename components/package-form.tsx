"use client"

import { useRouter } from "next/navigation"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import {
  IconUsers,
  IconClock,
  IconPackage,
  IconUserHeart,
} from "@tabler/icons-react"
import { usePackages, usePackage, PACKAGE_TYPES } from "@/lib/hooks/usePackages"
import { CreatePackageRequest, UpdatePackageRequest } from "@/lib/api/types"
import { toast } from "sonner"
import { FormHeader } from "@/components/form/form-header"
import { FormSection } from "@/components/form/form-section"
import { FormField, FormSelect, FormSwitch } from "@/components/form/form-field"
import { FormActions } from "@/components/form/form-actions"

// Validation Schema
const validationSchema = Yup.object({
  name: Yup.string()
    .required("Package name is required")
    .min(2, "Package name must be at least 2 characters"),
  type: Yup.string().required("Package type is required"),
  durationInMonths: Yup.number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 month")
    .max(60, "Duration cannot exceed 60 months"),
  noOfFamilies: Yup.number()
    .required("Number of families is required")
    .min(1, "Must have at least 1 family"),
  noOfKareReceivers: Yup.number()
    .required("Number of Kare Receivers is required")
    .min(1, "Must have at least 1 Kare Receiver"),
  noOfKareGivers: Yup.number()
    .required("Number of Kare Givers is required")
    .min(1, "Must have at least 1 Kare Giver"),
  noOfKareViewers: Yup.number()
    .required("Number of Kare Viewers is required")
    .min(1, "Must have at least 1 Kare Viewer"),
  isActive: Yup.boolean(),
})

interface PackageFormProps {
  mode: "add" | "edit"
  id?: number
}

const defaultValues = {
  name: "",
  type: "family",
  durationInMonths: 12,
  noOfFamilies: 1,
  noOfKareReceivers: 1,
  noOfKareGivers: 1,
  noOfKareViewers: 1,
  isActive: true,
}

export function PackageForm({ mode, id }: PackageFormProps) {
  const router = useRouter()
  const { createPackage, updatePackage } = usePackages()
  const { data: packageData, isLoading } = usePackage(id || 0)

  const initialValues = mode === "edit" && packageData ? {
    name: packageData.name,
    type: packageData.type.toLowerCase(), // Ensure lowercase for form
    durationInMonths: packageData.durationInMonths,
    noOfFamilies: packageData.noOfFamilies,
    noOfKareReceivers: packageData.noOfKareReceivers,
    noOfKareGivers: packageData.noOfKareGivers,
    noOfKareViewers: packageData.noOfKareViewers,
    isActive: packageData.isActive,
  } : defaultValues

  const handleSubmit = async (values: typeof defaultValues) => {
    try {
      // Ensure type is stored in lowercase
      const payload = {
        ...values,
        type: values.type.toLowerCase(), // Store in lowercase
      }

      if (mode === "add") {
        const createPayload: CreatePackageRequest = {
          id: 0, // API will assign ID
          ...payload,
        }
        await createPackage.mutateAsync(createPayload)
        toast.success("Package created successfully")
      } else if (mode === "edit" && id) {
        const updatePayload: UpdatePackageRequest = {
          id: id,
          ...payload,
        }
        await updatePackage.mutateAsync(updatePayload)
        toast.success("Package updated successfully")
      }
      router.push("/packages")
    } catch (error) {
      toast.error(`Failed to ${mode === "add" ? "create" : "update"} package`)
      console.error("Form submission error:", error)
    }
  }

  if (mode === "edit" && isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      <FormHeader
        title={mode === "add" ? "Create New Package" : "Edit Package"}
        description={mode === "add" ? "Create a new subscription package with pricing and features" : "Update package information and settings"}
        onBack={() => router.back()}
      />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-6">
            {/* Package Information */}
            <FormSection
              title="Package Information"
              description="Basic package details and configuration (* Required fields)"
              icon={<IconPackage className="h-5 w-5 text-primary" />}
              highlight
            >
              <FormSwitch
                name="isActive"
                label="Active Package"
                description="Enable or disable this package for new subscriptions"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  name="name"
                  label="Package Name"
                  placeholder="Enter package name"
                  required
                />
                <FormSelect
                  name="type"
                  label="Package Type"
                  placeholder="Select package type"
                  options={PACKAGE_TYPES}
                  required
                />
              </div>
            </FormSection>

            {/* Duration & Limits */}
            <FormSection
              title="Duration & Limits"
              description="Package duration and user limits"
              icon={<IconClock className="h-5 w-5 text-primary" />}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  name="durationInMonths"
                  label="Duration (Months)"
                  type="number"
                  placeholder="12"
                  required
                />
                <FormField
                  name="noOfFamilies"
                  label="Number of Families"
                  type="number"
                  placeholder="1"
                  required
                />
              </div>
            </FormSection>

            {/* User Limits */}
            <FormSection
              title="User Limits"
              description="Define the number of users allowed for each role"
              icon={<IconUsers className="h-5 w-5 text-primary" />}
            >
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  name="noOfKareReceivers"
                  label="Kare Receivers"
                  type="number"
                  placeholder="1"
                  required
                  icon={<IconUserHeart className="h-4 w-4" />}
                />
                <FormField
                  name="noOfKareGivers"
                  label="Kare Givers"
                  type="number"
                  placeholder="1"
                  required
                  icon={<IconUsers className="h-4 w-4" />}
                />
                <FormField
                  name="noOfKareViewers"
                  label="Kare Viewers"
                  type="number"
                  placeholder="1"
                  required
                  icon={<IconUsers className="h-4 w-4" />}
                />
              </div>
            </FormSection>

            <FormActions
              mode={mode}
              onCancel={() => router.back()}
              isSubmitting={isSubmitting || createPackage.isPending || updatePackage.isPending}
              submitLabel={mode === "add" ? "Create Package" : "Save Changes"}
            />
          </Form>
        )}
      </Formik>
    </div>
  )
}