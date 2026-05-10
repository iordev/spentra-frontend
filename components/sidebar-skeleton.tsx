// components/sidebar-skeleton.tsx
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { navOverview, navAccessControl, navMasterData, navFinancials, NavGroup } from "@/lib/data";

type Props = {
  hasAnyPermission: (permissions: string[]) => boolean;
};

const SidebarNavSkeleton = ({ count }: { count: number }) => {
  if (count === 0) return null;
  return (
    <SidebarGroup>
      <Skeleton className="h-3 w-[40%] mx-2 mb-2" />
      <SidebarGroupContent>
        <SidebarMenu>
          {Array.from({ length: count }).map((_, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuSkeleton showIcon />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export const SidebarSkeleton = ({ hasAnyPermission }: Props) => {
  // Count visible items per section based on permissions
  const countVisible = (groups: NavGroup[]) =>
    groups.reduce(
      (acc, group) =>
        acc +
        group.items.filter(item => !item.permissions?.length || hasAnyPermission(item.permissions))
          .length,
      0
    );

  const overviewCount = countVisible(navOverview);
  const accessControlCount = countVisible(navAccessControl);
  const masterDataCount = countVisible(navMasterData);

  // Financial needs special handling due to subItems on Reports
  const financialItems = (navFinancials as NavGroup[])
    .flatMap(g => g.items)
    .filter(item => !item.permissions?.length || hasAnyPermission(item.permissions ?? []));
  const financialCount = financialItems.length;
  const hasReports = financialItems.some(item => item.subItems?.length);

  return (
    <>
      <SidebarNavSkeleton count={overviewCount} />
      <SidebarNavSkeleton count={accessControlCount} />
      <SidebarNavSkeleton count={masterDataCount} />

      {/* Financial — handle Reports subItems separately */}
      {financialCount > 0 && (
        <SidebarGroup>
          <Skeleton className="h-3 w-[40%] mx-2 mb-2" />
          <SidebarGroupContent>
            <SidebarMenu>
              {Array.from({ length: financialCount }).map((_, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              ))}
              {/* Only show sub skeletons if Reports item is visible */}
              {hasReports && (
                <div className="ml-6 flex flex-col gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-7 w-[80%] rounded-md" />
                  ))}
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </>
  );
};
