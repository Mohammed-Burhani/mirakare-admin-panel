"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface FormSectionProps {
  title: string
  description?: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
  highlight?: boolean
}

export function FormSection({ 
  title, 
  description, 
  icon, 
  children, 
  className = "",
  highlight = false
}: FormSectionProps) {
  return (
    <Card className={`${highlight ? "border-2 border-primary/20" : ""} ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  )
}