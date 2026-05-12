"use client";

import { ChevronRight, LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type SubItem = {
  title: string;
  url: string;
};

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: SubItem[];
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const NavOverview = ({ items }: { items: NavGroup[] }) => {
  const pathname = usePathname();

  return (
    <>
      {items.map(group => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map(item => {
                const hasSubItems = !!item.subItems?.length;

                const isItemActive = pathname === item.url || pathname.startsWith(item.url + "/");

                const isSubItemActive = item.subItems?.some(
                  sub => pathname === sub.url || pathname.startsWith(sub.url + "/")
                );

                const isActive = isItemActive || isSubItemActive;

                // ===============================
                // COLLAPSIBLE ITEM
                // ===============================
                if (hasSubItems) {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen={isActive}
                      asChild
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                            <Link href={item.url} className="flex items-center gap-2 flex-1">
                              {item.icon && <item.icon className="h-4 w-4" />}
                              <span>{item.title}</span>
                            </Link>

                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems!.map(subItem => {
                              const isSubActive =
                                pathname === subItem.url || pathname.startsWith(subItem.url + "/");

                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild isActive={isSubActive}>
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
                }

                // ===============================
                // NORMAL ITEM
                // ===============================
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isItemActive} tooltip={item.title}>
                      <Link href={item.url} className="flex items-center gap-2">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>

                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
};

export default NavOverview;
