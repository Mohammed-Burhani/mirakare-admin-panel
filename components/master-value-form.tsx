"use client"

import { useRouter } from "next/navigation"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { IconDatabase } from "@tabler/icons-react"
import { useMasterValues, useMasterValue, MASTER_VALUE_TYPES } from "@/lib/hooks/useMasterValues"
import { CreateMasterValueRequest, UpdateMasterValueRequest } from "@/lib/api/types"
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
  id?: number
}

const defaultValues = {
  text: "",
  description: "",
  type: 0,
  isPublished: true,
}

export function MasterValueForm({ mode, id }: MasterValueFormProps) {
  const router = useRouter()
  const { createMasterValue, updateMasterValue } = useMasterValues()
  const { data: masterValue, isLoading } = useMasterValue(id || 0)

  const initialValues = mode === "edit" && masterValue ? {
    text: masterValue.text,
    description: masterValue.description || "",
    type: masterValue.type,
    isPublished: masterValue.isPublished,
  } : defaultValues

  const handleSubmit = async (values: typeof defaultValues) => {
    try {
      if (mode === "add") {
        const payload: CreateMasterValueRequest = {
          id: 0, // API will assign ID
          text: values.text,
          description: values.description || "",
          type: values.type,
          isPublished: values.isPublished,
          createdDate: new Date().toISOString(),
        }
        await createMasterValue.mutateAsync(payload)
        toast.success("Master Value created successfully")
      } else if (mode === "edit" && id) {
        const payload: UpdateMasterValueRequest = {
          id: id,
          text: values.text,
          description: values.description || "",
          type: values.type,
          isPublished: values.isPublished,
          createdDate: masterValue?.createdDate || new Date().toISOString(),
        }
        await updateMasterValue.mutateAsync(payload)
        toast.success("Master Value updated successfully")
      }
      router.push("/masters/master-values")
    } catch (error) {
      toast.error(`Failed to ${mode === "add" ? "create" : "update"} Master Value`)
      console.error("Form submission error:", error)
    }
  }

  if (mode === "edit" && isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      <FormHeader
        title={mode === "add" ? "Add New Master Value" : "Edit Master Value"}
        description={mode === "add" ? "Create a new master data value" : "Update master value information"}
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
              title="Master Value Information"
              description="Basic master value details (* Required fields)"
              icon={<IconDatabase className="h-5 w-5 text-primary" />}
              highlight
            >
              <FormSwitch
                name="isPublished"
                label="Is Active"
                description="Enable or disable this master value"
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