import { IconLoader } from "@tabler/icons-react"

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-2">
        <IconLoader className="h-4 w-4 animate-spin" />
        <span>{message}</span>
      </div>
    </div>
  )
}
