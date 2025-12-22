"use client"

import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik"
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
  IconPackage,
  IconUsers,
  IconEye,
  IconUserHeart,
  IconCurrency,
  IconClock,
  IconPlus,
  IconTrash,
  IconList,
} from "@tabler/icons-react"
import { usePackages, PACKAGE_TYPES } from "@/lib/hooks/usePackages"
import { toast } from "sonner"

// Validation Schema
const validationSchema = Yup.object({
  name: Yup.string()
    .required("Package name is required")
    .min(2, "Package name must be at least 2 characters"),
  type: Yup.string().required("Package type is required"),
  isActive: Yup.boolean(),
  durationInMonths: Yup.number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 month")
    .max(60, "Duration cannot exceed 60 months"),
  noOfKareReceivers: Yup.number()
    .required("Number of Kare Receivers is required")
    .min(1, "Must have at least 1 Kare Receiver"),
  noOfKareGivers: Yup.number()
    .required("Number of Kare Givers is required")
    .min(1, "Must have at least 1 Kare Giver"),
  noOfKareViewers: Yup.number()
    .required("Number of Kare Viewers is required")
    .min(1, "Must have at least 1 Kare Viewer"),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Price cannot be negative"),
  description: Yup.string(),
  features: Yup.array().of(Yup.string()),
})

interface PackageFormProps {
  mode: "add" | "edit"
  initialValues?: {
    id?: number
    name: string
    type: string
    isActive: boolean
    durationInMonths: number
    noOfKareReceivers: number
    noOfKareGivers: number
    noOfKareViewers: number
    price: number
    description: string
    features: string[]
  }
}

const defaultValues = {
  name: "",
  type: "",
  isActive: true,
  durationInMonths: 12,
  noOfKareReceivers: 1,
  noOfKareGivers: 1,
  noOfKareViewers: 1,
  price: 0,
  description: "",
  features: [""],
}

export function PackageForm({ mode, initialValues }: PackageFormProps) {
  const router = useRouter()
  const { createPackage, updatePackage } = usePackages()

  const handleSubmit = async (values: typeof defaultValues) => {
    try {
      // Filter out empty features
      const filteredFeatures = values.features.filter(feature => feature.trim() !== "")
      
      const packageData = {
        ...values,
        features: filteredFeatures,
      }

      if (mode === "add") {
        await createPackage.mutateAsync(packageData)
        toast.success("Package created successfully")
      } else {
        const id = (initialValues as any)?.id
        if (id) {
          await updatePackage.mutateAsync({ id: parseInt(id), ...packageData })
          toast.success("Package updated successfully")
        }
      }
      router.push("/packages")
    } catch (error) {
      toast.error(`Failed to ${mode === "add" ? "create" : "update"} package`)
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
            {mode === "add" ? "Create New Package" : "Edit Package"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "add"
              ? "Create a new subscription package with pricing and features"
              : "Update package information and settings"}
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
            {/* Package Information */}
            <Card className="border-2 border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <IconPackage className="h-5 w-5 text-primary" />
                  <CardTitle>Package Information</CardTitle>
                </div>
                <CardDescription>
                  Basic package details and configuration (* Required fields)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Active Status */}
                <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
                  <Switch
                    id="isActive"
                    checked={values.isActive}
                    onCheckedChange={(checked) => setFieldValue("isActive", checked)}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">
                      Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={values.type}
                      onValueChange={(value) => setFieldValue("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PACKAGE_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
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

                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      name="name"
                      type="text"
                      placeholder="Enter package name"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="text-destructive text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Duration */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <IconCurrency className="h-5 w-5 text-primary" />
                  <CardTitle>Pricing & Duration</CardTitle>
                </div>
                <CardDescription>
                  Package pricing and subscription duration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="durationInMonths" className="flex items-center gap-2">
                      <IconClock className="h-4 w-4" />
                      Duration In Months <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      name="durationInMonths"
                      type="number"
                      min="1"
                      max="60"
                      placeholder="12"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <ErrorMessage
                      name="durationInMonths"
                      component="p"
                      className="text-destructive text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="flex items-center gap-2">
                      <IconCurrency className="h-4 w-4" />
                      Price (USD) <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="29.99"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <ErrorMessage
                      name="price"
                      component="p"
                      className="text-destructive text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Limits */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <IconUsers className="h-5 w-5 text-primary" />
                  <CardTitle>User Limits</CardTitle>
                </div>
                <CardDescription>
                  Define the number of users allowed for each role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="noOfKareReceivers" className="flex items-center gap-2">
                      <IconUserHeart className="h-4 w-4" />
                      No of Kare Receivers <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      name="noOfKareReceivers"
                      type="number"
                      min="1"
                      placeholder="1"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <ErrorMessage
                      name="noOfKareReceivers"
                      component="p"
                      className="text-destructive text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="noOfKareGivers">
                      No of Kare Givers <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      name="noOfKareGivers"
                      type="number"
                      min="1"
                      placeholder="1"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <ErrorMessage
                      name="noOfKareGivers"
                      component="p"
                      className="text-destructive text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="noOfKareViewers">
                      No of Kare Viewers <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      name="noOfKareViewers"
                      type="number"
                      min="1"
                      placeholder="1"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <ErrorMessage
                      name="noOfKareViewers"
                      component="p"
                      className="text-destructive text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description & Features */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <IconList className="h-5 w-5 text-primary" />
                  <CardTitle>Description & Features</CardTitle>
                </div>
                <CardDescription>
                  Package description and feature list
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Enter package description..."
                    rows={3}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Features</Label>
                  <FieldArray name="features">
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {values.features.map((_, index) => (
                          <div key={index} className="flex gap-2">
                            <Field
                              name={`features.${index}`}
                              type="text"
                              placeholder="Enter feature description"
                              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {values.features.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => remove(index)}
                                className="h-10 w-10 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => push("")}
                          className="gap-2"
                        >
                          <IconPlus className="h-4 w-4" />
                          Add Feature
                        </Button>
                      </div>
                    )}
                  </FieldArray>
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
                Back
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
                disabled={isSubmitting || createPackage.isPending || updatePackage.isPending} 
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