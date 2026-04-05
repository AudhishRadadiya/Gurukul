import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Button,
  ClickAwayListener,
  Divider,
  Grow,
  MenuList,
  ButtonGroup as MuiButtonGroup,
  MenuItem as MuiMenuItem,
  Paper,
  Popper,
  type SxProps,
} from "@mui/material";
import _isFunction from "lodash/isFunction";
import { Fragment, useRef, useState, type ReactNode } from "react";
import type { OnAction } from "../utils/types";

export type SplitButtonMenuItem = {
  key: string;
  label: string;
  onClick: OnAction;
  divider?: boolean;
};

export type SplitButtonProps = {
  icon?: ReactNode;
  label: string;
  size?: "small" | "medium" | "large";
  onClick?: OnAction;
  menuItems?: SplitButtonMenuItem[];
  sx?: SxProps;
  containerSx?: SxProps;
  variant?: "contained" | "text";
};

export const SplitButton = ({
  icon,
  label,
  size = "medium",
  onClick,
  menuItems = [],
  sx,
  containerSx,
  variant = "contained",
}: SplitButtonProps) => {
  const [open, setOpen] = useState(false);

  const anchorRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setOpen((prev) => !prev);

  const handleClose = (event: Event) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  const handleMainClick = () => {
    if (_isFunction(onClick)) {
      onClick();
    }
  };

  const handleMenuItemClick = (item: SplitButtonMenuItem) => {
    if (_isFunction(item.onClick)) {
      item.onClick();
    }
    setOpen(false);
  };

  return (
    <>
      <MuiButtonGroup
        ref={anchorRef}
        sx={{
          boxShadow: "none",
          border: "none !important",
          position: "relative",
          ...containerSx,
        }}
      >
        <Button
          variant={variant}
          size={size}
          startIcon={icon}
          onClick={handleMainClick}
          sx={sx}
        >
          {label}
        </Button>

        <Button
          size={size}
          variant={variant}
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          onClick={handleToggle}
          sx={{ width: "32px", minWidth: "32px", ...sx }}
        >
          <ArrowDropDownIcon />
        </Button>
      </MuiButtonGroup>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="bottom-end"
        sx={{ zIndex: 1300 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper elevation={3}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  {menuItems.map((item) => (
                    <Fragment key={item.key}>
                      <MuiMenuItem onClick={() => handleMenuItemClick(item)}>
                        {item.label}
                      </MuiMenuItem>

                      {item.divider && (
                        <Divider
                          sx={{
                            border: "none",
                            borderTop: "1px solid #eee",
                            margin: 0,
                          }}
                        />
                      )}
                    </Fragment>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
