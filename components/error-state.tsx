import { Button } from "@/components/ui/button"
import { IconRefresh } from "@tabler/icons-react"

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = "Error loading data", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <p className="text-destructive">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="gap-2">
          <IconRefresh className="h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  )
}
