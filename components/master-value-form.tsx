"use client"

import { useRouter } from "next/navigation"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { IconDatabase } from "@tabler/icons-react"
import { useMasterValues, MASTER_VALUE_TYPES } from "@/lib/hooks/useMasterValues"
import { toast } from "sonner"
import { FormHeader } from "@/components/form/form-header"
import { FormSection } from "@/components/form/form-section"
import { FormField, FormSelect, FormSwitch, FormTextarea } from "@/components/form/form-field"
import { FormActions } from "@/components/form/form-actions"

// Validation Schema
const validationSchema = Yup.object({
  text: Yup.string()
    .required("Text is required")
    .min(2, "Text must be at least 2 characters"),
  description: Yup.string(),
  type: Yup.number()
    .required("Type is required")
    .min(1, "Please select a valid type"),
  isPublished: Yup.boolean(),
})

interface MasterValueFormProps {
  mode: "add" | "edit"
  initialValues?: {
    id?: number
    text: string
    description: string
    type: number
    isPublished: boolean
  }
}

const defaultValues = {
  text: "",
  description: "",
  type: 0,
  isPublished: true,
}

export function MasterValueForm({ mode, initialValues }: MasterValueFormProps) {
  const router = useRouter()
  const { createMasterValue, updateMasterValue } = useMasterValues()

  const handleSubmit = async (values: typeof defaultValues) => {
    try {
      const masterValueData = {
        text: values.text,
        description: values.description || null,
        type: values.type,
        isPublished: values.isPublished,
      }

      if (mode === "add") {
        await createMasterValue.mutateAsync(masterValueData)
        toast.success("Master Value created successfully")
      } else {
        const id = (initialValues as any)?.id
        if (id) {
          await updateMasterValue.mutateAsync({ id: parseInt(id), ...masterValueData })
          toast.success("Master Value updated successfully")
        }
      }
      router.push("/masters/master-values")
    } catch (error) {
      toast.error(`Failed to ${mode === "add" ? "create" : "update"} Master Value`)
      console.error("Form submission error:", error)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      <FormHeader
        title={mode === "add" ? "Add New Master Value" : "Edit Master Value"}
        description={mode === "add" ? "Create a new master data value" : "Update master value information"}
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
              title="Master Value Information"
              description="Basic master value details (* Required fields)"
              icon={<IconDatabase className="h-5 w-5 text-primary" />}
              highlight
            >
              <FormSwitch
                name="isPublished"
                label="Is Active"
              />

              <FormSelect
                name="type"
                label="Type"
                placeholder="Select Type"
                options={MASTER_VALUE_TYPES}
                required
              />

              <FormField
                name="text"
                label="Text"
                placeholder="Enter text value"
                required
              />

              <FormTextarea
                name="description"
                label="Description"
                placeholder="Enter description (optional)"
                rows={4}
              />
            </FormSection>

            <FormActions
              mode={mode}
              onCancel={() => router.back()}
              isSubmitting={isSubmitting || createMasterValue.isPending || updateMasterValue.isPending}
            />
          </Form>
        )}
      </Formik>
    </div>
  )
}