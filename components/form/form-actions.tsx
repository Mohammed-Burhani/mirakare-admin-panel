"use client"

import { Button } from "@/components/ui/button"
import { IconDeviceFloppy, IconX } from "@tabler/icons-react"
import { useFormikContext } from "formik"

interface FormActionsProps {
  mode: "add" | "edit"
  onCancel: () => void
  isSubmitting?: boolean
  submitLabel?: string
  cancelLabel?: string
}

export function FormActions({ 
  mode, 
  onCancel, 
  isSubmitting = false,
  submitLabel,
  cancelLabel = "Cancel"
}: FormActionsProps) {
  const { dirty, resetForm } = useFormikContext()
  
  const defaultSubmitLabel = mode === "add" ? "Add" : "Save Changes"
  
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          resetForm()
          onCancel()
        }}
        className="gap-2 border-muted-foreground/30 hover:bg-muted"
      >
        <IconX className="h-4 w-4" />
        {cancelLabel}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => resetForm()}
        disabled={!dirty}
        className="gap-2 border-muted-foreground/30 hover:bg-muted"
      >
        Clear
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <IconDeviceFloppy className="h-4 w-4" />
        {submitLabel || defaultSubmitLabel}
      </Button>
    </div>
  )
}