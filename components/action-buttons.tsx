import { Button } from "@/components/ui/button"
import { IconEdit, IconTrash } from "@tabler/icons-react"

interface ActionButtonsProps {
  onEdit: () => void
  onDelete: () => void
  layout?: "horizontal" | "vertical"
}

export function ActionButtons({
  onEdit,
  onDelete,
  layout = "horizontal",
}: ActionButtonsProps) {
  const containerClass = layout === "horizontal" ? "flex gap-2" : "space-y-2"

  return (
    <div className={containerClass}>
      <Button
        variant="outline"
        size="sm"
        className="flex-1 gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
        onClick={onEdit}
      >
        <IconEdit className="h-4 w-4" />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/30"
        onClick={onDelete}
      >
        <IconTrash className="h-4 w-4" />
        Delete
      </Button>
    </div>
  )
}
