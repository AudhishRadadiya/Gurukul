import type { StackProps } from "@mui/material";
import { IconButton, Menu, MenuItem, Stack } from "@mui/material";
import _noop from "lodash/noop";
import { Fragment, useState } from "react";
import { Button } from "../Button";
import type { ActionButton, DataProps } from "./types";

export type ActionButtonsProps = DataProps & {
  buttons: ActionButton[];
  justifyContent?: StackProps["justifyContent"];
};

// COMPONENT
export function ActionButtons({
  buttons,
  justifyContent = "end",
}: ActionButtonsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    key: string
  ) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuKey(key);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuKey(null);
  };

  return (
    <Stack direction="row" gap="1.6rem" justifyContent={justifyContent}>
      {buttons
        .filter((button) => !button.hidden)
        .map(({ menuItems, key, ...button }) => {
          const visibleMenuItems = menuItems?.filter(
            (menuItem) => !menuItem.hidden
          );

          const isMenuOpen = openMenuKey === button.key;

          const onClick =
            visibleMenuItems && visibleMenuItems.length > 0
              ? (e: React.MouseEvent<HTMLButtonElement>) =>
                  handleMenuOpen(e, button.key)
              : (button.onClick ?? _noop);

          const buttonProps = {
            ...button,
            onClick,
          };

          return (
            <Fragment key={key}>
              {button.label ? (
                <Button key={key} {...buttonProps}>
                  {button.label}
                </Button>
              ) : (
                <IconButton key={key} {...buttonProps}>
                  {button.icon}
                </IconButton>
              )}
              {/* Render Menu */}
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
