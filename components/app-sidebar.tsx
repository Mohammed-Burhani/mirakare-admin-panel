"use client"

import * as React from "react"
import {
  IconActivity,
  IconAddressBook,
  // IconChartLine,
  IconDashboard,
  IconHelp,
  IconId,
  IconSearch,
  IconSettings,
  IconShieldCheck,
  IconTrendingUp,
  IconUserHeart,
  IconUserPlus,
  IconUsersGroup,
  IconDatabase,
  IconUsers,
  IconPackage,
  IconChevronRight,
} from "@tabler/icons-react"
// import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavReports } from "@/components/nav-reports"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const data = {
  user: {
    name: "Admin User",
    email: "admin@mirakare.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Family Profile",
      url: "/family-profile",
      icon: IconId,
    },
    {
      title: "Kare Admins",
      url: "/kare-admins",
      icon: IconShieldCheck,
    },
    {
      title: "Kare Recipients",
      url: "/kare-recipients",
      icon: IconUserPlus,
    },
    {
      title: "Kare Givers",
      url: "/kare-givers",
      icon: IconUsersGroup,
    },
    {
      title: "Kare Viewers",
      url: "/kare-viewers",
      icon: IconUserHeart,
    },
    {
      title: "Contacts",
      url: "/contacts",
      icon: IconAddressBook,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: IconTrendingUp,
    },
  ],
  // System Admin specific modules
  navMasters: {
    title: "Masters",
    icon: IconDatabase,
    url: "#",
    items: [
      {
        title: "Vital Types",
        url: "/masters/vital-types",
      },
      {
        title: "Master Values",
        url: "/masters/master-values",
      },
    ],
  },
  navSystemAdmin: [
    {
      title: "Subscribers",
      url: "/subscribers",
      icon: IconUsers,
    },
    {
      title: "Packages",
      url: "/packages",
      icon: IconPackage,
    },
  ],
  // navReports: {
  //   title: "Reports",
  //   icon: IconChartLine,
  //   url: "#",
  //   items: [
  //     {
  //       title: "Vital Stats",
  //       url: "/reports/vital-stats",
  //     },
  //     {
  //       title: "Care Summary",
  //       url: "/reports/care-summary",
  //     },
  //     {
  //       title: "Activity Logs",
  //       url: "/reports/activity-logs",
  //     },
  //   ],
  // },
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/search",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5! bg-primary/10 border border-primary/20 hover:bg-primary/20"
            >
              <Link href="/">
                <IconActivity className="size-5! text-primary" />
                <span className="text-base font-semibold text-primary">MiraKare</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavReports report={data.navMasters} />
        <NavMain items={data.navSystemAdmin} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
