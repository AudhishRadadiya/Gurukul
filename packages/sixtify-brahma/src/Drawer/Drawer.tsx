"use client";

import { Box, ClickAwayListener } from "@mui/material";
import List from "@mui/material/List";
import {
  useState,
  type HTMLAttributeAnchorTarget,
  type ReactNode,
  useEffect,
} from "react";

import { PadBox } from "../PadBox";
import { useGetDeviceType } from "../utils/hooks/useGetDeviceType";
import { CloseDrawerMenuItemList } from "./CloseDrawer/CloseDrawerMenuItemList";
import { StyledDrawer } from "./Drawer.styled";
import { OpenDrawerMenuItemList } from "./OpenDrawer/OpenDrawerMenuItemList";

export type MenuItem = {
  key: string; // this key should be unique in list
  icon?: ReactNode;
  title: string;
  onClick?: (href: string, target?: HTMLAttributeAnchorTarget) => void;
  menuItems?: MenuItem[];
  isView?: boolean;
};

export type DrawerProps = {
  menuItems?: MenuItem[];
  open: boolean;
  currentPathname: string;
  appLogoMedium: ReactNode;
  appLogoSmall: ReactNode;
};

export const Drawer = ({
  menuItems = [],
  open,
  currentPathname,
  appLogoMedium,
  appLogoSmall,
}: DrawerProps) => {
  const { layout } = useGetDeviceType();

  const isDesktop = layout === "desktop";

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    // For close the ToolTip when the drawer is closed on desktop
    if (isDesktop && !!open && !!anchorEl) {
      handleClose();
    }
  }, [isDesktop]);

  return (
    <StyledDrawer variant="permanent" open={open}>
      <Box textAlign="center">
        {isDesktop && (
          <PadBox padding={{ paddingTop: "1.5rem" }}>
            {open ? appLogoMedium : appLogoSmall}
          </PadBox>
        )}

        {!isDesktop && (
          <PadBox padding={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}>
            {appLogoSmall}
          </PadBox>
        )}
      </Box>

      {isDesktop && (
        <List component="nav" onMouseLeave={handleClose}>
          {open ? (
            <OpenDrawerMenuItemList
              menuItems={menuItems}
              currentPathname={currentPathname}
            />
          ) : (
            <CloseDrawerMenuItemList
              menuItems={menuItems}
              currentPathname={currentPathname}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
            />
          )}
        </List>
      )}

      {!isDesktop && (
        <ClickAwayListener
          onClickAway={(event) => {
            const target = event.target as HTMLElement | null;

            if (target?.closest(".MuiPopper-root")) {
              return;
            }

            handleClose();
          }}
        >
          <List component="nav" onMouseLeave={handleClose}>
            <CloseDrawerMenuItemList
              menuItems={menuItems}
              currentPathname={currentPathname}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
            />
          </List>
        </ClickAwayListener>
      )}
    </StyledDrawer>
  );
};
