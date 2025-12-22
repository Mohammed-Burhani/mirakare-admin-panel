"use client"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { ViewToggle } from "@/components/view-toggle"
import { IconPlus } from "@tabler/icons-react"

interface ListingHeaderProps {
  title: string
  description: string
  view: "card" | "table"
  onViewChange: (view: "card" | "table") => void
  onAdd: () => void
  addLabel?: string
}

export function ListingHeader({
  title,
  description,
  view,
  onViewChange,
  onAdd,
  addLabel = "Add New"
}: ListingHeaderProps) {
  return (
    <PageHeader
      title={title}
      description={description}
      actions={
        <>
          <ViewToggle view={view} onViewChange={onViewChange} />
          <Button
            onClick={onAdd}
            className="gap-2"
          >
            <IconPlus className="h-4 w-4" />
            {addLabel}
          </Button>
        </>
      }
    />
  )
}