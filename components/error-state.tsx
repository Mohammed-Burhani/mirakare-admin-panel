interface ErrorStateProps {
  message?: string
}

export function ErrorState({ message = "Error loading data" }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-destructive">{message}</p>
    </div>
  )
}
