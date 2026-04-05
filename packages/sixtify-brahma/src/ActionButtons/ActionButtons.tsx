import type { StackProps, SxProps } from "@mui/material";
import { Button, IconButton, Menu, MenuItem, Stack } from "@mui/material";
import _noop from "lodash/noop";
import { Fragment, useRef, useState } from "react";
import { useGlobalKeyboardShortcut } from "../utils";
import type { ActionButton, DataProps } from "./types";

export type ActionButtonsProps = DataProps & {
  buttons: ActionButton[];
  justifyContent?: StackProps["justifyContent"];
  sx?: SxProps;
  buttonSx?: SxProps;
  shouldOpenMenuOnShortcut?: boolean;
  shortcutKey?: string;
};

export function ActionButtons({
  buttons,
  justifyContent = "end",
  sx,
  buttonSx,
  shouldOpenMenuOnShortcut = false,
  shortcutKey = "a",
}: ActionButtonsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);

  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement> | HTMLButtonElement,
    key: string
  ) => {
    const element = event instanceof HTMLElement ? event : event.currentTarget;

    setAnchorEl(element);
    setOpenMenuKey(key);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuKey(null);
  };

  useGlobalKeyboardShortcut({
    key: shortcutKey,
    modifierKeys: ["ctrl", "shift"],
    onTrigger: () => {
      if (shouldOpenMenuOnShortcut) {
        const buttonWithMenu = buttons.find(
          (button) => !!button.menuItems?.length && !button.hidden
        );

        if (buttonWithMenu) {
          const buttonElement = buttonRefs.current[buttonWithMenu.key];

          if (buttonElement) {
            handleMenuOpen(buttonElement, buttonWithMenu.key);
          }
        }
      }
    },
  });

  return (
    <Stack direction="row" sx={sx} gap="1.6rem" justifyContent={justifyContent}>
      {buttons
        .filter((button) => !button.hidden)
        .map(({ menuItems, key, ...button }) => {
          const visibleMenuItems = menuItems?.filter(
            (menuItem) => !menuItem.hidden
          );

          const isMenuOpen = openMenuKey === key;

          const onClick =
            visibleMenuItems && visibleMenuItems.length > 0
              ? (e: React.MouseEvent<HTMLButtonElement>) =>
                  handleMenuOpen(e, key)
              : (button.onClick ?? _noop);

          const buttonProps = {
            ...button,
            onClick,
          };

          return (
            <Fragment key={key}>
              {button.label ? (
                <Button
                  sx={buttonSx}
                  key={key}
                  {...buttonProps}
                  ref={(el) => {
                    buttonRefs.current[key] = el;
                  }}
                >
                  {button.label}
                </Button>
              ) : (
                <IconButton
                  key={key}
                  ref={(el) => {
                    buttonRefs.current[key] = el;
                  }}
                  {...buttonProps}
                >
                  {button.icon}
                </IconButton>
              )}

              {isMenuOpen && visibleMenuItems && (
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl && isMenuOpen)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal:
                      button.menuPlacement === "left" ? "left" : "right",
                  }}
                >
                  {/* eslint-disable-next-line sonarjs/function-return-type */}
                  {visibleMenuItems.map((item) => {
                    if (item.subMenuItems && item.subMenuItems.length > 0) {
                      return item.subMenuItems.map((sub) => (
                        <MenuItem
                          key={sub.key}
                          // eslint-disable-next-line sonarjs/no-nested-functions
                          onClick={() => {
                            handleMenuClose();
                            sub.onClick?.();
                          }}
                        >
                          {sub.icon}
                          {sub.label}
                        </MenuItem>
                      ));
                    }

                    return (
                      <MenuItem
                        key={item.key}
                        onClick={() => {
                          handleMenuClose();
                          item.onClick?.();
                        }}
                      >
                        {item.icon}
                        {item.label}
                      </MenuItem>
                    );
                  })}
                </Menu>
              )}
            </Fragment>
          );
        })}
    </Stack>
  );
}
