import { usePathname } from "next/navigation";

import { SubMenuKey, type SubMenuSlug } from "./subMenuKey";

export type HeaderBreadcrumbRoute = {
  isDashboard: boolean;
  isEventDonation: boolean;
  subMenuKey: SubMenuSlug | null;
};

const isSubMenuKey = (value: string) => {
  const subMenuKeySet = Object.values(SubMenuKey);

  return !!value && subMenuKeySet.includes(value);
};

export function useHeaderBreadcrumbRoute(): HeaderBreadcrumbRoute {
  const pathname = usePathname();

  const isDashboard = pathname === "/";

  const isEventDonation = pathname === "/event/donation";

  const segment = pathname?.split("/")[2] ?? "";

  const subMenuKey = isSubMenuKey(segment) ? segment : null;

  return {
    isDashboard,
    isEventDonation,
    subMenuKey,
  };
}
