// hooks/use-filtered-nav.ts
import { useAuth } from "@/context/auth-context";
import { NavGroup } from "@/lib/data";

export function useFilteredNav(groups: NavGroup[]): NavGroup[] {
  const { hasAnyPermission } = useAuth();

  return groups
    .map(group => ({
      ...group,
      items: group.items.filter(
        item =>
          // No permissions = visible to all
          !item.permissions?.length || hasAnyPermission(item.permissions)
      ),
    }))
    .filter(group => group.items.length > 0); // hide empty groups
}
