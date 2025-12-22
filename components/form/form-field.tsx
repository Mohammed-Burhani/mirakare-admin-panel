"use client"

import { Field, ErrorMessage, useFormikContext } from "formik"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

interface FormFieldProps {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  icon?: React.ReactNode
  className?: string
}

export function FormField({ 
  name, 
  label, 
  type = "text", 
  placeholder, 
  required = false, 
  icon,
  className = ""
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={icon ? "flex items-center gap-2" : ""}>
        {icon}
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Field
        name={name}
        type={type}
        placeholder={placeholder}
        className={`border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      />
      <ErrorMessage
        name={name}
        component="p"
        className="text-destructive text-sm"
      />
    </div>
  )
}

interface FormTextareaProps {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  rows?: number
  icon?: React.ReactNode
}

export function FormTextarea({ 
  name, 
  label, 
  placeholder, 
  required = false, 
  rows = 4,
  icon
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={icon ? "flex items-center gap-2" : ""}>
        {icon}
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Field
        as="textarea"
        name={name}
        placeholder={placeholder}
        rows={rows}
        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <ErrorMessage
        name={name}
        component="p"
        className="text-destructive text-sm"
      />
    </div>
  )
}

interface FormSelectProps {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  options: { id: string | number; name: string }[]
  icon?: React.ReactNode
}

export function FormSelect({ 
  name, 
  label, 
  placeholder = "Select option", 
  required = false, 
  options,
  icon
}: FormSelectProps) {
  const { values, setFieldValue } = useFormikContext<any>()
  
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={icon ? "flex items-center gap-2" : ""}>
        {icon}
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Select
        value={values[name]?.toString()}
        onValueChange={(value) => setFieldValue(name, value)}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id.toString()}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ErrorMessage
        name={name}
        component="p"
        className="text-destructive text-sm"
      />
    </div>
  )
}

interface FormSwitchProps {
  name: string
  label: string
  description?: string
}

export function FormSwitch({ name, label, description }: FormSwitchProps) {
  const { values, setFieldValue } = useFormikContext<any>()
  
  return (
    <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
      <Switch
        id={name}
        checked={values[name]}
        onCheckedChange={(checked) => setFieldValue(name, checked)}
      />
      <div className="flex flex-col">
        <Label htmlFor={name} className="cursor-pointer">{label}</Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
}

interface FormCheckboxProps {
  name: string
  label: string
  description?: string
  icon?: React.ReactNode
}

export function FormCheckbox({ name, label, description, icon }: FormCheckboxProps) {
  const { values, setFieldValue } = useFormikContext<any>()
  
  return (
    <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
      <Checkbox
        id={name}
        checked={values[name]}
        onCheckedChange={(checked) => setFieldValue(name, checked)}
      />
      <Label htmlFor={name} className={`cursor-pointer ${icon ? "flex items-center gap-2" : ""}`}>
        {icon}
        <div className="flex flex-col">
          <span>{label}</span>
          {description && (
            <span className="text-sm text-muted-foreground">{description}</span>
          )}
        </div>
      </Label>
    </div>
  )
}