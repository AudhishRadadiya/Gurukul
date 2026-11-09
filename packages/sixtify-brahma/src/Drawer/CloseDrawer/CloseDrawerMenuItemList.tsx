import { Box } from "@mui/material";
import { isEmpty as _isEmpty } from "lodash";
import {
  type HTMLAttributeAnchorTarget,
  type MouseEvent,
  useMemo,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { urlToNestedObject } from "../../utils/urlToNestedObject";
import type { MenuItem } from "../Drawer";
import { CloseDrawerMenuItem } from "./CloseDrawerMenuItem";
import {
  CloseDrawerSubMenuItemList,
  type MenuOpenState,
} from "./CloseDrawerSubMenuItemList";
import { Popper } from "./Popper";

type CloseDrawerMenuItemListProps = {
  menuItems: MenuItem[];
  currentPathname: string;
  anchorEl: HTMLDivElement | null;
  setAnchorEl: (anchorEl: HTMLDivElement | null) => void;
};

export const CloseDrawerMenuItemList = ({
  menuItems,
  currentPathname,
  anchorEl,
  setAnchorEl,
}: CloseDrawerMenuItemListProps) => {
  const [currentMenuItem, setCurrentMenuItem] = useState<MenuItem>();

  const [currentMenuIndex, setCurrentMenuIndex] = useState<number>(0);

  const [currentPathMenuOpen, setCurrentPathMenuOpen] = useState<MenuOpenState>(
    {}
  );

  useMemo(() => {
    const obj = urlToNestedObject(currentPathname);

    if (_isEmpty(obj)) {
      return setCurrentPathMenuOpen({ home: true });
    }

    setCurrentPathMenuOpen(obj);
  }, [currentPathname]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {menuItems
        .filter((item) => item.isView !== false)
        .map((menuItem, i) => {
          const { onClick, key: key1, icon, menuItems = [] } = menuItem;

          const hasSubMenu = menuItems.length > 0;

          const openSubMenu = (event: MouseEvent<HTMLDivElement>) => {
            setAnchorEl(event.currentTarget);
            setCurrentMenuItem(menuItem);
            setCurrentMenuIndex(i);
          };

          const handleClick = (target?: HTMLAttributeAnchorTarget) => {
            if (hasSubMenu) {
              return;
            }

            if (onClick) {
              if (key1 === "home") {
                onClick("/", target);

                return;
              }

              onClick(`/${key1}`, target);
            }
          };

          const onMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
            if (hasSubMenu) {
              openSubMenu(event);
            } else {
              handleClose();
            }
          };

          const isMenuSelected = !!currentPathMenuOpen?.[key1];

          return (
            <CloseDrawerMenuItem
              key={uuidv4()}
              onClick={handleClick}
              {...(hasSubMenu && { onOpen: openSubMenu })}
              onMouseEnter={onMouseEnter}
              icon={icon}
              selected={isMenuSelected}
            />
          );
        })}

      {!!anchorEl && (
        <Box onMouseLeave={handleClose}>
          <Popper
            open={true}
            anchorEl={anchorEl}
            currentMenuIndex={currentMenuIndex}
          >
            <CloseDrawerSubMenuItemList
              currentMenuItem={currentMenuItem}
              currentPathMenuOpen={currentPathMenuOpen}
              onCloseMenuPopover={handleClose}
            />
          </Popper>
        </Box>
      )}
    </>
  );
};
