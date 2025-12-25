import { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap xl:flex-nowrap gap-4 items-center justify-between border-b border-primary/20 pb-4 mb-6">
      <div>
        <h1 className="text-2xl xl:text-3xl font-bold tracking-tight text-primary">{title}</h1>
        {description && (
          <p className="text-sm xl:text-base text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
