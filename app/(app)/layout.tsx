import React, { ReactNode } from "react";
import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { SystemSettingsButton } from "@/components/system-settings-button";

import SearchCommandMenu from "@/components/search-command-menu";

import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumbs";

const AppLayout = async ({ children }: { children: ReactNode }) => {
  // Get sidebar state from cookies
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("spentra_sidebar_state")?.value === "true";

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

          {/*</div>*/}
          <div className="flex items-center gap-2 px-3  flex-1 justify-end">
            <SearchCommandMenu />
            <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
            <ModeToggle />
            <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
            <SystemSettingsButton />
          </div>
        </header>

        {/* Page content */}
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
