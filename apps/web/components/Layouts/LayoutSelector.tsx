import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { PrivatePageLayout } from "@web/components/Layouts/PrivatePageLayout";
import { PublicPageLayout } from "@web/components/Layouts/PublicPageLayout";

type LayoutSelectorProps = {
  authPage?: boolean;
  children: ReactNode;
  setupUserPath?: boolean;
};

export const LayoutSelector = ({ children }: LayoutSelectorProps) => {
  const currentPathname = usePathname();

  const authPage = currentPathname.startsWith("/auth");

  const setupUserPath = currentPathname.startsWith("/onboard");

  if (setupUserPath) {
    return children;
  }

  return authPage ? (
    <PublicPageLayout>{children}</PublicPageLayout>
  ) : (
    <PrivatePageLayout>{children}</PrivatePageLayout>
  );
};
