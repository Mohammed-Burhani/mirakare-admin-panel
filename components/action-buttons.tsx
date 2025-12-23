import { Button } from "@/components/ui/button"
import { IconEdit, IconTrash } from "@tabler/icons-react"
import { Module } from "@/lib/utils/permissions"
import { usePermissions } from "@/components/auth/PermissionGuard"

interface ActionButtonsProps {
  onEdit: () => void
  onDelete: () => void
  module: Module
  layout?: "horizontal" | "vertical"
}

export function ActionButtons({
  onEdit,
  onDelete,
  module,
  layout = "horizontal",
}: ActionButtonsProps) {
  const { canUpdate, canDelete } = usePermissions(module)
  const containerClass = layout === "horizontal" ? "flex gap-2" : "space-y-2"

  // If user has no permissions, don't render anything
  if (!canUpdate && !canDelete) {
    return null
  }

  return (
    <div className={containerClass}>
      {canUpdate && (
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={onEdit}
        >
          <IconEdit className="h-4 w-4" />
          Edit
        </Button>
      )}
      {canDelete && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/30"
          onClick={onDelete}
        >
          <IconTrash className="h-4 w-4" />
          Delete
        </Button>
      )}
    </div>
  )
}
