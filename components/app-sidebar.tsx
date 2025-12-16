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

import { NavMain } from "@/components/navigation/nav-main"
import { NavUser } from "@/components/navigation/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"

const data = {
  user: {
    name: "Registrar Admin",
    avatar: "/avatars/registrar.png",
  },

  navMain: [
    {
      title: "Birth Certificate",
      url: "/admin/livebirth",
      icon: FileText,
      isActive: true,
    },
    {
      title: "Death Certificate",
      url: "/admin/pdf",
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
              <Link href="/admin/livebirth">
                <div className="bg-sidebar-border text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image src="/logos/lgu-carigara.png" alt="MCRO Logo" width={24} height={24} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">MCRO</span>
                  <span className="truncate text-xs">LGU Carigara</span>
                </div>
              </Link>
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
