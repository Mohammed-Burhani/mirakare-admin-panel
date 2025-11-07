import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface ContainerProps {
    children: React.ReactNode
    className?: string
}

export default function Container({ children, className }: ContainerProps) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className={cn("@container/main flex flex-1 flex-col gap-2", className)}>
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
