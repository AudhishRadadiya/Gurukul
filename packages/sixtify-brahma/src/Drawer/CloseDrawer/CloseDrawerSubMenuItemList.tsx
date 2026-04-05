import { Box, List } from "@mui/material";
import {
  useState,
  type HTMLAttributeAnchorTarget,
  type MouseEvent,
} from "react";
import { type MenuItem } from "../Drawer";
import { CloseDrawerMenuItem } from "./CloseDrawerMenuItem";
import { Popper } from "./Popper";
import type { OnAction } from "../../utils/types";

export type MenuOpenState = {
  [key: string]: MenuOpenState | boolean;
};

type RecursiveMenuItemProps = {
  item: MenuItem;
  parentPath: string;
  currentPathMenuOpen: MenuOpenState;
  onCloseMenuPopover: OnAction;
  level?: number;
};

const RecursiveMenuItem = ({
  item,
  parentPath,
  currentPathMenuOpen,
  onCloseMenuPopover,
  level = 0,
}: RecursiveMenuItemProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const isOpen = Boolean(anchorEl);

  if (item?.isView === false) {
    return;
  }

  const handlePopoverOpen = (event: MouseEvent<HTMLDivElement>) => {
    if (item.menuItems?.length) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (target: HTMLAttributeAnchorTarget = "_self") => {
    const fullPath = `${parentPath}/${item.key}`;

    if (item.onClick) {
      item.onClick(fullPath, target);

      if (target !== "_blank") {
        handleClose();
        onCloseMenuPopover();
      }
    }
  };

  const isSelected = Boolean(currentPathMenuOpen[item.key]);

  const currentPath = `${parentPath}/${item.key}`;

  return (
    <Box onMouseLeave={handleClose}>
      <CloseDrawerMenuItem
        onClick={handleClick}
        title={item.title}
        icon={item.icon}
        isShowEndAdornment={Boolean(item.menuItems?.length)}
        selected={isSelected}
        onMouseEnter={handlePopoverOpen}
      />

      {item.menuItems?.length && isOpen && (
        <Popper open={true} anchorEl={anchorEl} currentMenuIndex={level}>
          <List disablePadding>
            {item.menuItems.map((subItem) => (
              <RecursiveMenuItem
                key={subItem.key}
                item={subItem}
                parentPath={currentPath}
                currentPathMenuOpen={
                  (currentPathMenuOpen[item.key] as MenuOpenState) ?? {}
                }
                onCloseMenuPopover={onCloseMenuPopover}
                level={level + 1}
              />
            ))}
          </List>
        </Popper>
      )}
    </Box>
  );
};

type CloseDrawerSubMenuItemListProps = {
  currentPathMenuOpen: MenuOpenState;
  currentMenuItem?: MenuItem;
  onCloseMenuPopover: OnAction;
};

export const CloseDrawerSubMenuItemList = ({
  currentPathMenuOpen,
  currentMenuItem,
  onCloseMenuPopover,
}: CloseDrawerSubMenuItemListProps) => {
  if (!currentMenuItem) {
    return <>Loading...</>;
  }

  return (
    <List disablePadding>
      {currentMenuItem.menuItems
        ?.filter((item) => item.isView !== false)
        .map((item) => (
          <RecursiveMenuItem
            key={item.key}
            item={item}
            parentPath={`/${currentMenuItem.key}`}
            currentPathMenuOpen={
              (currentPathMenuOpen[currentMenuItem.key] as MenuOpenState) ?? {}
            }
            onCloseMenuPopover={onCloseMenuPopover}
          />
        ))}
    </List>
  );
};
