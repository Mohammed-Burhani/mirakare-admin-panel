"use client"

import { useRouter } from "next/navigation"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { IconActivity } from "@tabler/icons-react"
import { useVitalTypes } from "@/lib/hooks/useVitalTypes"
import { toast } from "sonner"
import { FormHeader } from "@/components/form/form-header"
import { FormSection } from "@/components/form/form-section"
import { FormField } from "@/components/form/form-field"
import { FormSwitch } from "@/components/form/form-field"
import { FormActions } from "@/components/form/form-actions"

// Validation Schema
const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  providerName: Yup.string()
    .required("Provider name is required")
    .min(2, "Provider name must be at least 2 characters"),
  isActive: Yup.boolean(),
})

interface VitalTypeFormProps {
  mode: "add" | "edit"
  initialValues?: {
    id?: number
    name: string
    providerName: string
    isActive: boolean
  }
}

const defaultValues = {
  name: "",
  providerName: "",
  isActive: true,
}

export function VitalTypeForm({ mode, initialValues }: VitalTypeFormProps) {
  const router = useRouter()
  const { createVitalType, updateVitalType } = useVitalTypes()

  const handleSubmit = async (values: typeof defaultValues) => {
    try {
      if (mode === "add") {
        await createVitalType.mutateAsync(values)
        toast.success("Vital Type created successfully")
      } else {
        const id = (initialValues as any)?.id
        if (id) {
          await updateVitalType.mutateAsync({ id: parseInt(id), ...values })
          toast.success("Vital Type updated successfully")
        }
      }
      router.push("/masters/vital-types")
    } catch (error) {
      toast.error(`Failed to ${mode === "add" ? "create" : "update"} Vital Type`)
      console.error("Form submission error:", error)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      <FormHeader
        title={mode === "add" ? "Add New Vital Type" : "Edit Vital Type"}
        description={mode === "add" ? "Create a new vital sign type" : "Update vital type information"}
        onBack={() => router.back()}
      />

      <Formik
        initialValues={initialValues || defaultValues}
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
                name="isActive"
                label="Active"
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