import { Drawer as SharedDrawer } from "@codezee/sixtify-brahma";
import { usePathname } from "next/navigation";

import { useDrawerMenuItems } from "@web/components/Drawer/hooks/useDrawerMenuItems";

export const Drawer = ({ open }: { open: boolean }) => {
  const currentPathname = usePathname();

  const { menuItems } = useDrawerMenuItems();

  return (
    <SharedDrawer
      menuItems={menuItems}
      open={open}
      currentPathname={currentPathname}
    />
  );
};
