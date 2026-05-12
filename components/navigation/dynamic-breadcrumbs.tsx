// components/dynamic-breadcrumb.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { allNavGroups } from "@/lib/data";

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Find the current navigation item
  let breadcrumbs: string[] = [];

  for (const group of allNavGroups) {
    if (group.items) {
      for (const item of group.items) {
        if (
          item.url === pathname ||
          (item.url && pathname.startsWith(item.url) && item.url !== "/")
        ) {
          breadcrumbs = [group.title, item.title];
          break;
        }
      }
    }
    if (breadcrumbs.length > 0) break;
  }

  // If no match, parse from pathname
  if (breadcrumbs.length === 0 && pathname !== "/") {
    const segments = pathname.replace(/^\/|\/$/g, "").split("/");
    breadcrumbs = segments.map(segment =>
      segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.length > 0}

        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx !== 0 && <BreadcrumbSeparator className="hidden sm:block" />}
            {idx === breadcrumbs.length - 1 ? (
              <BreadcrumbPage className="hidden sm:block">{crumb}</BreadcrumbPage>
            ) : (
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">{crumb}</BreadcrumbLink>
              </BreadcrumbItem>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
