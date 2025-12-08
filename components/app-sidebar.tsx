"use client"

import * as React from "react"
import {
  FileText,
  Heart,
  Cross,
  FileSignature,
  Command,
  LifeBuoy,
  Send,
  Frame,
  Map,
  PieChart,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
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

const data = {
  user: {
    name: "Registrar Admin",
    avatar: "/avatars/registrar.png",
  },

  // MAIN NAVIGATION (REGISTRAR)
  navMain: [
    {
      title: "Birth Certificate",
      url: "/admin/livebirth",
      icon: FileText,
      isActive: true,
    },
    {
      title: "Death Certificate",
      url: "/death-certificate",
      icon: Cross,
    },
    {
      title: "Marriage Certificate",
      url: "/marriage-certificate",
      icon: Heart,
    },

    {
      title: "Application for Marriage Certificate",
      url: "/apply-marriage",
      icon: FileSignature,
    },
  ],


}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">MCRO</span>
                  <span className="truncate text-xs">LGU Carigara</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
