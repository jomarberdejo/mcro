"use client";

import { useEffect, useState } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    color?: string;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const [openItem, setOpenItem] = useState<string | null>(null);

  useEffect(() => {
    const activeItem = items.find((item) =>
      item.items?.some((subItem) => subItem.url === pathname),
    );

    if (activeItem) {
      setOpenItem(activeItem.title);
    }
  }, [pathname, items]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-base">Main</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;
          const isActive = pathname === item.url;

          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className="text-base py-6"
                  onClick={() => setOpenItem(null)}
                >
                  <Link href={item.url}>
                    <item.icon className={`shrink-0 ${item.color}`} />
                    <span className={item.color}>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              open={openItem === item.title}
              onOpenChange={(open) =>
                setOpenItem(open ? item.title : null)
              }
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="text-base py-6"
                  >
                    <item.icon className={`shrink-0 ${item.color}`} />
                    <span className={item.color}>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubActive = pathname === subItem.url;

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubActive}
                            className="text-base py-5"
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
