"use client"

import { Button } from "@/components/ui/button"
import { IconLayoutGrid, IconTable } from "@tabler/icons-react"

interface ViewToggleProps {
  view: "card" | "table"
  onViewChange: (view: "card" | "table") => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-md border p-1">
      <Button
        variant={view === "card" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("card")}
        className="gap-2 min-h-2! xl:min-h-auto"
      >
        <IconLayoutGrid className="h-4 w-4" />
        Card
      </Button>
      <Button
        variant={view === "table" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("table")}
        className="gap-2 min-h-2! xl:min-h-auto"
      >
        <IconTable className="h-4 w-4" />
        Table
      </Button>
    </div>
  )
}
