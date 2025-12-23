"use client"

import { useRouter } from "next/navigation"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { IconActivity } from "@tabler/icons-react"
import { useVitalTypes, useVitalType } from "@/lib/hooks/useVitalTypes"
import { toast } from "sonner"
import { FormHeader } from "@/components/form/form-header"
import { FormSection } from "@/components/form/form-section"
import { FormField } from "@/components/form/form-field"
import { FormSwitch } from "@/components/form/form-field"
import { FormActions } from "@/components/form/form-actions"
import { CreateVitalTypeRequest, UpdateVitalTypeRequest } from "@/lib/api/types"

// Validation Schema
const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  providerName: Yup.string()
    .required("Provider name is required")
    .min(2, "Provider name must be at least 2 characters"),
  isManual: Yup.boolean(),
})

interface VitalTypeFormProps {
  mode: "add" | "edit"
  id?: number
}

const defaultValues = {
  name: "",
  providerName: "",
  isManual: true,
}

export function VitalTypeForm({ mode, id }: VitalTypeFormProps) {
  const router = useRouter()
  const { createVitalType, updateVitalType } = useVitalTypes()
  const { data: vitalType, isLoading } = useVitalType(id || 0)

  const initialValues = mode === "edit" && vitalType ? {
    name: vitalType.name,
    providerName: vitalType.providerName,
    isManual: vitalType.isManual,
  } : defaultValues

  const handleSubmit = async (values: typeof defaultValues) => {
    try {
      if (mode === "add") {
        const payload: CreateVitalTypeRequest = {
          id: 0, // API will assign ID
          name: values.name,
          providerName: values.providerName,
          isManual: values.isManual,
          createdDate: new Date().toISOString(),
        }
        await createVitalType.mutateAsync(payload)
        toast.success("Vital Type created successfully")
      } else if (mode === "edit" && id) {
        const payload: UpdateVitalTypeRequest = {
          id: id,
          name: values.name,
          providerName: values.providerName,
          isManual: values.isManual,
          createdDate: vitalType?.createdDate || new Date().toISOString(),
        }
        await updateVitalType.mutateAsync(payload)
        toast.success("Vital Type updated successfully")
      }
      router.push("/masters/vital-types")
    } catch (error) {
      toast.error(`Failed to ${mode === "add" ? "create" : "update"} Vital Type`)
      console.error("Form submission error:", error)
    }
  }

  if (mode === "edit" && isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      <FormHeader
        title={mode === "add" ? "Add New Vital Type" : "Edit Vital Type"}
        description={mode === "add" ? "Create a new vital sign type" : "Update vital type information"}
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
            <FormSection
              title="Vital Type Information"
              description="Basic vital type details (* Required fields)"
              icon={<IconActivity className="h-5 w-5 text-primary" />}
              highlight
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  name="name"
                  label="Name"
                  placeholder="Enter vital type name"
                  required
                />
                <FormField
                  name="providerName"
                  label="Provider Name"
                  placeholder="Enter provider name"
                  required
                />
              </div>
              <FormSwitch
                name="isManual"
                label="Manual Entry"
                description="Enable manual data entry for this vital type"
              />
            </FormSection>

            <FormActions
              mode={mode}
              onCancel={() => router.back()}
              isSubmitting={isSubmitting || createVitalType.isPending || updateVitalType.isPending}
            />
          </Form>
        )}
      </Formik>
    </div>
  )
}