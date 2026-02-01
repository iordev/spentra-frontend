// /lib/breadcrumbs.ts
import { allNavGroups } from "@/lib/data";

export function getActiveBreadcrumbs(currentPath: string) {
  // If it's the root, return empty or home
  if (currentPath === "/") {
    return ["Dashboard"];
  }

  // Find the matching navigation item
  for (const group of allNavGroups) {
    if (group.items) {
      for (const item of group.items) {
        // Check if current path matches the item's URL
        if (item.url === currentPath) {
          return [group.title, item.title];
        }

        // For nested routes (e.g., /users/123), check if starts with
        if (item.url && currentPath.startsWith(item.url) && item.url !== "/") {
          return [group.title, item.title];
        }
      }
    }
  }

  // If no match found, return a default or parse from path
  return parsePathToBreadcrumbs(currentPath);
}

function parsePathToBreadcrumbs(path: string): string[] {
  // Remove leading/trailing slashes and split
  const segments = path.replace(/^\/|\/$/g, "").split("/");

  // Convert to breadcrumb format (capitalize, replace hyphens, etc.)
  return segments.map(segment =>
    segment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}
