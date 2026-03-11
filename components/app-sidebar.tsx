"use client";

import * as React from "react";
import {
  FileText,
  Heart,
  Cross,
  ClipboardList,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/navigation/nav-main";
import { NavUser } from "@/components/navigation/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/use-auth";

const baseNav = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
    color: "text-blue-600",
  },
  {
    title: "Birth Certificate",
    url: "/admin/birth-certificate",
    icon: FileText,
    color: "text-green-600",
    items: [
      { title: "View Records",   url: "/admin/birth-certificate" },
      { title: "Add New Record", url: "/admin/birth-certificate/new" },
    ],
  },
  {
    title: "Death Certificate",
    url: "/admin/death-certificate",
    icon: Cross,
    color: "text-black",
    items: [
      { title: "View Records",   url: "/admin/death-certificate" },
      { title: "Add New Record", url: "/admin/death-certificate/new" },
    ],
  },
  {
    title: "Marriage Certificate",
    url: "/admin/marriage-certificate",
    icon: Heart,
    color: "text-red-600",
    items: [
      { title: "View Records",   url: "/admin/marriage-certificate" },
      { title: "Add New Record", url: "/admin/marriage-certificate/new" },
    ],
  },
  {
    title: "AML",
    url: "/admin/marriage-cert-app",
    icon: ClipboardList,
    color: "text-violet-600",
    items: [
      { title: "View Applications", url: "/admin/marriage-cert-app" },
      { title: "Add New Application", url: "/admin/marriage-cert-app/new" },
    ],
  },
];

// const adminOnlyNav = [
//   {
//     title: "User Accounts",
//     url: "/admin/users",
//     icon: Users,
//     color: "text-sky-600",
//   },
//   {
//     title: "Audit Trail",
//     url: "/admin/audit-trail",
//     icon: ShieldCheck,
//     color: "text-amber-600",
//   },
// ];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Always render baseNav on SSR so the collapsible count is stable.
  // Only add admin items after client mount to avoid Radix ID mismatch.
  const navItems =
    // mounted && user?.role === "ADMIN" ? [...baseNav, ...adminOnlyNav] : baseNav;

    mounted && user?.role === "ADMIN" ? [...baseNav] : baseNav;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/birth-certificate">
                <div className="bg-sidebar-border text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src="/logos/lgu-carigara.png"
                    alt="MCRO Logo"
                    width={24}
                    height={24}
                    className="h-auto w-auto"
                  />
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
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}