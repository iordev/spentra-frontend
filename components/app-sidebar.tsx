"use client";

import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarContent,
  SidebarFooter,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import NavOverview from "@/components/nav-overview";
import NavAccessControl from "@/components/nav-access-control";
import NavMasterData from "@/components/nav-master-data";
import NavFinancial from "@/components/nav-financial";
import { NavUser } from "@/components/nav-user";

import { user, navOverview, navAccessControl, navMasterData, navFinancials } from "@/lib/data";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [loading, setLoading] = useState(true);

  // 2️⃣ UseEffect to hide skeleton after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          {loading ? (
            <SidebarMenuItem>
              <SidebarMenuSkeleton showIcon={true} />
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                className="
            hover:bg-transparent
            hover:text-inherit
            active:bg-transparent
            active:text-inherit
            cursor-default
            pointer-events-none
          "
              >
                <Link href="/">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/favicon.ico" alt="App logo" />
                    <AvatarFallback className="rounded-lg">S</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">Spentra</span>
                    <span className="">v1.0.0</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 20 }).map((_, index) => {
              // Example logic: every 3rd item is a short skeleton without icon
              const showIcon = index % 4 !== 0;
              const widthClass = showIcon ? "w-full" : "w-[50%]";

              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuSkeleton showIcon={showIcon} className={widthClass} />
                </SidebarMenuItem>
              );
            })}
          </div>
        ) : (
          <>
            <NavOverview items={navOverview} />
            <NavAccessControl items={navAccessControl} />
            <NavMasterData items={navMasterData} />
            <NavFinancial items={navFinancials} />
            {/*<NavReport items={navReports} />*/}
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        {loading ? (
          <SidebarMenuItem>
            <SidebarMenuSkeleton showIcon={true} />
          </SidebarMenuItem>
        ) : (
          <NavUser user={user} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
