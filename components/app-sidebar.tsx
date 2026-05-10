"use client";

import React from "react";
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
import { navOverview, navAccessControl, navMasterData, navFinancials } from "@/lib/data";
import { useAuth } from "@/context/auth-context";
import { useFilteredNav } from "@/hooks/use-filtered-nav";
import { SidebarSkeleton } from "@/components/sidebar-skeleton"; // ← import from file
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { me, loading, hasAnyPermission } = useAuth();

  const filteredOverview = useFilteredNav(navOverview);
  const filteredAccessControl = useFilteredNav(navAccessControl);
  const filteredMasterData = useFilteredNav(navMasterData);
  const filteredFinancials = useFilteredNav(navFinancials);

  return (
    <Sidebar {...props} collapsible="icon">
      {/* ── Header ── */}
      <SidebarHeader>
        <SidebarMenu>
          {loading ? (
            <SidebarMenuItem>
              <SidebarMenuSkeleton showIcon />
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                className="
                  hover:bg-transparent hover:text-inherit
                  active:bg-transparent active:text-inherit
                  cursor-default pointer-events-none
                "
              >
                <Link href="/">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/favicon.ico" alt="App logo" />
                    <AvatarFallback className="rounded-lg">S</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">Spentra</span>
                    <span className="text-xs text-muted-foreground">v1.0.0</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Content ── */}
      <SidebarContent>
        {loading ? (
          <SidebarSkeleton hasAnyPermission={me ? hasAnyPermission : () => true} />
        ) : (
          <>
            <NavOverview items={filteredOverview} />
            <NavAccessControl items={filteredAccessControl} />
            <NavMasterData items={filteredMasterData} />
            <NavFinancial items={filteredFinancials} />
          </>
        )}
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter>
        {loading ? (
          <SidebarMenuItem>
            <SidebarMenuSkeleton showIcon />
          </SidebarMenuItem>
        ) : me ? (
          <NavUser
            user={{
              name: me.fullName,
              email: me.email,
              avatar: me.avatarUrl ?? "",
            }}
          />
        ) : // loading is done but me is null — unauthenticated, redirect
        null}
      </SidebarFooter>
    </Sidebar>
  );
}
