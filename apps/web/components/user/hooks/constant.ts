import type { DrawerMenuItemsKeys } from "@web/components/Drawer/hooks/useDrawerMenuItems";

export const ROUTES_WITH_BRANCH_SELECTOR: DrawerMenuItemsKeys[] = [
  "donation",
  "event",
  "address",
] as const;

export const REPORT_ROUTES_WITH_BRANCH_SELECTOR =
  "/report/donation-collection-report" as const;

export const ROUTES_WITHOUT_BRANCH_SELECTOR = [
  {
    pathname: "/donation/donation-entry/",
    queryParam: "page",
    queryValue: "edit-donation-entry",
  },
] as const;
