import React, { ReactNode } from "react";
import { cookies } from "next/headers";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DynamicBreadcrumb } from "@/components/navigation/dynamic-breadcrumbs";
import { HeaderActions } from "@/components/navigation/header-actions";

const AppLayout = async ({ children }: { children: ReactNode }) => {
  // Get sidebar state from cookies
  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get("spentra_sidebar_state")?.value;
  const defaultOpen = sidebarCookie !== undefined ? sidebarCookie === "true" : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content area with inset */}
      <SidebarInset>
        {/* Header with sidebar trigger and breadcrumb */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <DynamicBreadcrumb />
          </div>

          <HeaderActions />
        </header>

        {/* Page content */}
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
