"use client"

import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormSectionCard,
} from "@/components/form-section-accordion"
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconX,
  IconDatabase,
} from "@tabler/icons-react"
import { useMasterValues, MASTER_VALUE_TYPES } from "@/lib/hooks/useMasterValues"
import { toast } from "sonner"

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
      if (mode === "add") {
        const masterValueData = {
          text: values.text,
          description: values.description || null,
          type: values.type,
          isPublished: values.isPublished,
        }
        await createMasterValue.mutateAsync(masterValueData)
        toast.success("Master Value created successfully")
      } else {
        const id = (initialValues as unknown)?.id
        if (id) {
          const masterValueData = {
            text: values.text,
            description: values.description || null,
            type: values.type,
            isPublished: values.isPublished,
          }
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
            {mode === "add" ? "Add New Master Value" : "Edit Master Value"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "add"
              ? "Create a new master data value"
              : "Update master value information"}
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
            {/* Master Value Information Card */}
            <FormSectionCard
              title="Master Value Information"
              icon={IconDatabase}
              description="Basic master value details (* Required fields)"
            >
              <div className="grid gap-4">
                {/* Is Active Switch */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublished"
                    checked={values.isPublished}
                    onCheckedChange={(checked) => setFieldValue("isPublished", checked)}
                  />
                  <Label htmlFor="isPublished">Is Active</Label>
                </div>

                {/* Type Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="type">
                    Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={values.type > 0 ? values.type.toString() : undefined}
                    onValueChange={(value) => setFieldValue("type", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {MASTER_VALUE_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="type"
                    component="p"
                    className="text-destructive text-sm"
                  />
                </div>

                {/* Text Field */}
                <div className="space-y-2">
                  <Label htmlFor="text">
                    Text <span className="text-destructive">*</span>
                  </Label>
                  <Field
                    name="text"
                    type="text"
                    placeholder="Enter text value"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <ErrorMessage
                    name="text"
                    component="p"
                    className="text-destructive text-sm"
                  />
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Enter description (optional)"
                    rows={4}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
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
                disabled={isSubmitting || createMasterValue.isPending || updateMasterValue.isPending} 
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