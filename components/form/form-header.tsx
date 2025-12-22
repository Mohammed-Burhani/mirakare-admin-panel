"use client"

import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"

interface FormHeaderProps {
  title: string
  description: string
  onBack: () => void
}

export function FormHeader({ title, description, onBack }: FormHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={onBack}
        className="h-9 w-9"
      >
        <IconArrowLeft className="h-4 w-4" />
      </Button>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}