import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProfileCardProps {
  icon: ReactNode
  title: string
  subtitle?: ReactNode
  badge?: {
    label: string
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
  contactInfo: Array<{
    icon: ReactNode
    label: string
  }>
  actions: ReactNode
  onClick?: () => void
}

export function ProfileCard({
  icon,
  title,
  subtitle,
  badge,
  contactInfo,
  actions,
  onClick,
}: ProfileCardProps) {
  return (
    <Card
      className="group relative overflow-hidden transition-all hover:shadow-lg border-primary/20 hover:border-primary/40"
      onClick={onClick}
    >
      {badge && (
        <div className="absolute right-4 top-4 z-10">
          <Badge variant={badge.variant || "secondary"} className="shadow-sm">
            {badge.label}
          </Badge>
        </div>
      )}

      <CardContent className="p-6">
        {/* Profile Section */}
        <div className="mb-4 flex items-start gap-4">
          <div className="bg-primary/15 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-primary/20">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl font-semibold">{title}</h3>
            {subtitle && (
              <div className="text-muted-foreground mt-1 text-sm">
                {subtitle}
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 border-t pt-4">
          {contactInfo.map((info, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="text-muted-foreground h-4 w-4 shrink-0">
                {info.icon}
              </div>
              <span className="truncate text-sm">{info.label}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 border-t pt-4">{actions}</div>
      </CardContent>
    </Card>
  )
}
