"use client"

import { ReactNode } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import type { Icon } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface FormSectionAccordionProps {
  sections: {
    id: string
    title: string
    icon?: Icon
    description?: string
    content: ReactNode
    defaultOpen?: boolean
  }[]
  defaultValue?: string[]
}

export function FormSectionAccordion({
  sections,
  defaultValue,
}: FormSectionAccordionProps) {
  const defaultOpenSections =
    defaultValue || sections.filter((s) => s.defaultOpen).map((s) => s.id)

  return (
    <Accordion
      type="multiple"
      defaultValue={defaultOpenSections}
      className="flex flex-col gap-4"
    >
      {sections.map((section) => (
        <AccordionItem
          key={section.id}
          value={section.id}
          className="rounded-lg bg-muted border"
        >
          <AccordionTrigger className="hover:bg-muted/50 rounded-t-lg px-6 py-4 transition-colors data-[state=open]:bg-muted/50">
            <div className="flex items-center gap-3 text-left">
              {section.icon && (
                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <section.icon className="text-primary h-5 w-5" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{section.title}</h3>
                {section.description && (
                  <p className="text-muted-foreground text-sm">
                    {section.description}
                  </p>
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-4">
            {section.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

// Simpler version for single card with sections
interface FormSectionCardProps {
  title: string
  icon?: Icon
  description?: string
  children: ReactNode
  className?: string
}

export function FormSectionCard({
  title,
  icon: Icon,
  description,
  children,
  className,
}: FormSectionCardProps) {
  return (
    <Card className={cn(className, "bg-muted border")}>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-3">
          {Icon && (
            <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
              <Icon className="text-primary h-5 w-5" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}
