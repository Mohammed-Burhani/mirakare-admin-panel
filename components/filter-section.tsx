import { ReactNode } from "react"

interface FilterSectionProps {
  children: ReactNode
}

export function FilterSection({ children }: FilterSectionProps) {
  return (
    <div className="flex flex-col px-4 lg:px-6">
      {children}
    </div>
  )
}
