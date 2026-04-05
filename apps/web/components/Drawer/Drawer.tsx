import { Drawer as SharedDrawer } from "@codezee/sixtify-brahma";
import { usePathname } from "next/navigation";

import { AppLogo } from "@web/components/Drawer/AppLogo";
import { useDrawerMenuItems } from "@web/components/Drawer/hooks/useDrawerMenuItems";

export const Drawer = ({ open }: { open: boolean }) => {
  const currentPathname = usePathname();

  const { menuItems } = useDrawerMenuItems();

  return (
    <SharedDrawer
      appLogoMedium={<AppLogo size="medium" />}
      appLogoSmall={<AppLogo size="small" />}
      menuItems={menuItems}
      open={open}
      currentPathname={currentPathname}
    />
  );
};
