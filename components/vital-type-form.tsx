"use client"

import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  FormSectionCard,
} from "@/components/form-section-accordion"
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconX,
  IconActivity,
} from "@tabler/icons-react"
import { useVitalTypes } from "@/lib/hooks/useVitalTypes"
import { toast } from "sonner"

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
        const vitalTypeData = {
          name: values.name,
          providerName: values.providerName,
          isActive: values.isActive,
        }
        await createVitalType.mutateAsync(vitalTypeData)
        toast.success("Vital Type created successfully")
      } else {
        const id = (initialValues as any)?.id
        if (id) {
          const vitalTypeData = {
            name: values.name,
            providerName: values.providerName,
            isActive: values.isActive,
          }
          await updateVitalType.mutateAsync({ id: parseInt(id), ...vitalTypeData })
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
            {mode === "add" ? "Add New Vital Type" : "Edit Vital Type"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "add"
              ? "Create a new vital sign type"
              : "Update vital type information"}
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
            {/* Vital Type Information Card */}
            <FormSectionCard
              title="Vital Type Information"
              icon={IconActivity}
              description="Basic vital type details (* Required fields)"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Field
                    name="name"
                    type="text"
                    placeholder="Enter vital type name"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="text-destructive text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="providerName">
                    Provider Name <span className="text-destructive">*</span>
                  </Label>
                  <Field
                    name="providerName"
                    type="text"
                    placeholder="Enter provider name"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <ErrorMessage
                    name="providerName"
                    component="p"
                    className="text-destructive text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={values.isActive}
                  onCheckedChange={(checked) => setFieldValue("isActive", checked)}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </FormSectionCard>

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
                disabled={isSubmitting || createVitalType.isPending || updateVitalType.isPending} 
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