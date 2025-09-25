"use client";

import { Box, List, useTheme } from "@mui/material";
import { isEmpty as _isEmpty } from "lodash";
import { type HTMLAttributeAnchorTarget, useEffect, useState } from "react";
import { urlToNestedObject } from "../../utils/urlToNestedObject";
import type { MenuItem } from "../Drawer";
import { OpenDrawerCollapse } from "./OpenDrawerCollapse";
import { OpenDrawerMenuItem } from "./OpenDrawerMenuItem";

type OpenDrawerMenuItemListProps = {
  menuItems: MenuItem[];
  currentPathname: string;
};

export type NestedMenuState = {
  [K in MenuItem["key"]]?:
    | boolean
    | {
        [SubK in MenuItem["key"]]?: boolean | NestedMenuState;
      };
};

type MenuItemRecursiveProps = {
  menuItem: MenuItem;
  level?: number;
  parentPath?: string;
  subMenusOpen: NestedMenuState;
  setSubMenusOpen: (
    value: NestedMenuState | ((prev: NestedMenuState) => NestedMenuState)
  ) => void;
  currentPathMenuOpen: NestedMenuState;
};

const getNestedMenuState = (state: NestedMenuState, path: string[]) => {
  if (path.length === 0) {
    return false;
  }

  if (typeof state !== "object") {
    return false;
  }

  const [first, ...rest] = path;

  if (!first) {
    return false;
  }

  const nextState = state[first];

  if (rest.length === 0) {
    return Boolean(nextState);
  }

  return getNestedMenuState(nextState as NestedMenuState, rest);
};

const checkCurrentSelectedPath = (obj: unknown): boolean => {
  if (obj === true) {
    return true;
  }

  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  return Object.values(obj).every(checkCurrentSelectedPath);
};

export const isPathInCurrentSelection = (
  state: NestedMenuState,
  path: string[]
): boolean => {
  const result = path.reduce<unknown>((acc, segment) => {
    if (typeof acc !== "object" || acc === null || !(segment in acc)) {
      return undefined;
    }

    return (acc as Record<string, unknown>)[segment];
  }, state);

  return checkCurrentSelectedPath(result);
};

export const isMenuOpen = (state: NestedMenuState, path: string[]) => {
  const value = getNestedMenuState(state, path);

  return Boolean(value);
};

export const MenuItemRecursive = ({
  menuItem,
  level = 0,
  parentPath = "",
  subMenusOpen,
  setSubMenusOpen,
  currentPathMenuOpen,
}: MenuItemRecursiveProps) => {
  const theme = useTheme();

  if (level === 3) {
    return;
  }

  const { butterflyBlue, slate } = theme.palette.app.color;

  const { key, icon, title, isView, onClick, menuItems = [] } = menuItem;

  if (isView === false) {
    return;
  }

  const currentPath = parentPath ? `${parentPath}/${key}` : key;

  const pathArray = currentPath.split("/");

  const isMenuExpanded = isMenuOpen(subMenusOpen, pathArray);

  const isMenuSelected = isPathInCurrentSelection(
    currentPathMenuOpen,
    pathArray
  );

  const dynamicPadding = level * 3 + 1.5;

  const handleClick = (target?: HTMLAttributeAnchorTarget) => {
    if (menuItems.length > 0) {
      if (isMenuSelected) {
        return;
      }

      setSubMenusOpen((prev) => {
        const newState = { ...prev };

        let current = newState;

        for (let i = 0; i < pathArray.length - 1; i++) {
          const segment = pathArray[i];

          if (!segment) {
            continue;
          }

          current[segment] =
            typeof current[segment] === "object" ? current[segment] : {};
          current = current[segment] as NestedMenuState;
        }

        const lastSegment = pathArray[pathArray.length - 1];

        if (lastSegment) {
          current[lastSegment] = !isMenuExpanded;
        }

        return newState;
      });
    } else if (onClick && !isMenuSelected) {
      const path = key === "home" ? "/" : `/${currentPath}`;

      onClick(path, target);
    }
  };

  return (
    <Box key={key}>
      <OpenDrawerMenuItem
        sx={{
          paddingLeft: dynamicPadding,
          ":focus-visible": {
            border: `1px solid ${butterflyBlue[900]}`,
            backgroundColor: slate[900],
          },
        }}
        onClick={handleClick}
        icon={level === 0 ? icon : undefined}
        title={title}
        isShowEndAdornment={menuItems.length > 0 && level < 2}
        selected={isMenuSelected}
        isExpanded={isMenuExpanded}
      />

      {menuItems.length > 0 && (
        <OpenDrawerCollapse in={isMenuExpanded}>
          <List component="div" disablePadding>
            {menuItems.map((subMenuItem) => (
              <MenuItemRecursive
                key={subMenuItem.key}
                menuItem={subMenuItem}
                level={level + 1}
                parentPath={currentPath}
                subMenusOpen={subMenusOpen}
                setSubMenusOpen={setSubMenusOpen}
                currentPathMenuOpen={currentPathMenuOpen}
              />
            ))}
          </List>
        </OpenDrawerCollapse>
      )}
    </Box>
  );
};

export const OpenDrawerMenuItemList = ({
  menuItems,
  currentPathname,
}: OpenDrawerMenuItemListProps) => {
  const [subMenusOpen, setSubMenusOpen] = useState<NestedMenuState>({});

  const [currentPathMenuOpen, setCurrentPathMenuOpen] =
    useState<NestedMenuState>({});

  useEffect(() => {
    const navObj = urlToNestedObject(currentPathname);

    if (_isEmpty(navObj)) {
      setSubMenusOpen({ home: true });
      setCurrentPathMenuOpen({ home: true });

      return;
    }

    const subState = JSON.parse(JSON.stringify(navObj));

    const selState = JSON.parse(JSON.stringify(navObj));

    setSubMenusOpen(subState);
    setCurrentPathMenuOpen(selState);
  }, [currentPathname]);

  return menuItems.map((menuItem) => (
    <MenuItemRecursive
      key={menuItem.key}
      menuItem={menuItem}
      subMenusOpen={subMenusOpen}
      setSubMenusOpen={setSubMenusOpen}
      currentPathMenuOpen={currentPathMenuOpen}
    />
  ));
};
