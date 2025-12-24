"use client"

import * as React from "react"
import {
  IconActivity,
  IconAddressBook,
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
  IconBuilding,
  IconUserCog,
} from "@tabler/icons-react"
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
import { 
  canAccessModule, 
  Module, 
  isSystemAdmin, 
  isKareAdmin,
  isOrgAdmin
} from "@/lib/utils/permissions"

const data = {
  user: {
    name: "Admin User",
    email: "admin@mirakare.com",
    avatar: "/avatars/admin.jpg",
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Base navigation items available to all roles
  const baseNavItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
      module: Module.DASHBOARD,
    },
  ]

  // Org Admin specific navigation
  const orgAdminNavItems = [
    {
      title: "Organization Profile",
      url: "/organization-profile",
      icon: IconBuilding,
      module: Module.ORGANIZATION_PROFILE,
    },
    {
      title: "Kare Admins",
      url: "/kare-admins",
      icon: IconShieldCheck,
      module: Module.KARE_ADMINS,
    },
  ]

  // Kare Admin specific navigation
  const kareAdminNavItems = [
    {
      title: "Family Profile",
      url: "/family-profile",
      icon: IconId,
      module: Module.FAMILY_PROFILE,
    },
    {
      title: "Kare Admins",
      url: "/kare-admins",
      icon: IconShieldCheck,
      module: Module.KARE_ADMINS,
    },
    {
      title: "Kare Recipients",
      url: "/kare-recipients",
      icon: IconUserPlus,
      module: Module.KARE_RECIPIENTS,
    },
    {
      title: "Kare Givers",
      url: "/kare-givers",
      icon: IconUsersGroup,
      module: Module.KARE_GIVERS,
    },
    {
      title: "Kare Viewers",
      url: "/kare-viewers",
      icon: IconUserHeart,
      module: Module.KARE_VIEWERS,
    },
    {
      title: "Contacts",
      url: "/contacts",
      icon: IconAddressBook,
      module: Module.CONTACTS,
    },
  ]

  // System Admin specific navigation
  const systemAdminNavItems = [
    {
      title: "Subscribers",
      url: "/subscribers",
      icon: IconUsers,
      module: Module.SUBSCRIBERS,
    },
    {
      title: "Packages",
      url: "/packages",
      icon: IconPackage,
      module: Module.PACKAGES,
    },
  ]

  // Masters section for System Admin
  const mastersSection = {
    title: "Masters",
    icon: IconDatabase,
    url: "#",
    items: [
      {
        title: "Vital Types",
        url: "/masters/vital-types",
        module: Module.VITAL_TYPES,
      },
      {
        title: "Master Values",
        url: "/masters/master-values",
        module: Module.MASTER_VALUES,
      },
    ].filter(item => canAccessModule(item.module)),
  }

  // Administration section for System Admin
  const administrationSection = {
    title: "Administration",
    icon: IconUserCog,
    url: "#",
    items: [
      {
        title: "Roles",
        url: "/administration/roles",
        module: Module.ADMIN_ROLES,
      },
      {
        title: "Users",
        url: "/administration/users",
        module: Module.ADMIN_USERS,
      },
    ].filter(item => canAccessModule(item.module)),
  }

  // Reports section
  const reportsSection = {
    title: "Reports",
    icon: IconTrendingUp,
    url: "#",
    items: [
      {
        title: "Vital Stats",
        url: "/reports/vital-stats",
      },
      ...(isSystemAdmin() ? [
        {
          title: "Subscription Consumption",
          url: "/reports/subscription-consumption",
        }
      ] : [])
    ],
  }

  // Filter navigation items based on permissions
  const getFilteredNavItems = () => {
    let navItems = [...baseNavItems]

    // Add Org Admin items if user is Org Admin
    if (isOrgAdmin()) {
      navItems = [...navItems, ...orgAdminNavItems.filter(item => canAccessModule(item.module))]
    }

    // Add Kare Admin items if user has access
    if (isKareAdmin() || isSystemAdmin()) {
      navItems = [...navItems, ...kareAdminNavItems.filter(item => canAccessModule(item.module))]
    }

    // Add System Admin items if user is System Admin
    if (isSystemAdmin()) {
      navItems = [...navItems, ...systemAdminNavItems.filter(item => canAccessModule(item.module))]
    }

    return navItems.filter(item => canAccessModule(item.module))
  }

  const navSecondary = [
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
  ]

  const filteredNavItems = getFilteredNavItems()

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
        {/* Main Navigation */}
        <NavMain items={filteredNavItems} />
        
        {/* Masters Section - Only for System Admin */}
        {isSystemAdmin() && mastersSection.items.length > 0 && (
          <NavReports report={mastersSection} />
        )}
        
        {/* Administration Section - Only for System Admin */}
        {isSystemAdmin() && administrationSection.items.length > 0 && (
          <NavReports report={administrationSection} />
        )}
        
        {/* Reports Section - Available to System Admin, Kare Admin, and Org Admin */}
        {(isSystemAdmin() || isKareAdmin() || isOrgAdmin()) && canAccessModule(Module.REPORTS) && (
          <NavReports report={reportsSection} />
        )}
        
        {/* Secondary Navigation */}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
