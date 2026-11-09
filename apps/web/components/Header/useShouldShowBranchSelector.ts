import { usePathname, useSearchParams } from "next/navigation";

import { type DrawerMenuItemsKeys } from "@web/components/Drawer/hooks/useDrawerMenuItems";
import {
  DASHBOARD_ROUTES_WITH_BRANCH_SELECTOR,
  REPORT_ROUTES_WITH_BRANCH_SELECTOR,
  ROUTES_WITHOUT_BRANCH_SELECTOR,
  ROUTES_WITH_BRANCH_SELECTOR,
} from "@web/components/user/hooks/constant";

export function useShouldShowBranchSelector() {
  const currentPathname = usePathname();

  const searchParams = useSearchParams();

  const menuKey = currentPathname?.split("/")[1] as DrawerMenuItemsKeys;

  const shouldExcludeBranchSelector = ROUTES_WITHOUT_BRANCH_SELECTOR.some(
    (route) => {
      const pathnameMatches = currentPathname?.startsWith(route.pathname);

      const queryParamMatches =
        searchParams.get(route.queryParam) === route.queryValue;

      return pathnameMatches && queryParamMatches;
    }
  );

  return (
    !shouldExcludeBranchSelector &&
    (ROUTES_WITH_BRANCH_SELECTOR.includes(menuKey) ||
      currentPathname == REPORT_ROUTES_WITH_BRANCH_SELECTOR ||
      currentPathname == DASHBOARD_ROUTES_WITH_BRANCH_SELECTOR)
  );
}
