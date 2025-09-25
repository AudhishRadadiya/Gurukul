import {
  Popover as MuiPopover,
  useTheme,
  type PopoverProps,
} from "@mui/material";
import type { PropsWithChildren } from "react";

type ExtendedPopoverProps = {
  currentMenuIndex: number; // **Added Prop**
} & PropsWithChildren<PopoverProps>;

export const Popover = ({
  open,
  anchorEl,
  onClose,
  children,
  currentMenuIndex,
}: ExtendedPopoverProps) => {
  const theme = useTheme();

  const { mirage } = theme.palette.app.color;

  return (
    <MuiPopover
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          background: mirage[900],
          width: "200px",
          // eslint-disable-next-line sonarjs/no-all-duplicated-branches
          marginLeft: currentMenuIndex ? "64px" : "0px",
          marginTop: currentMenuIndex ? currentMenuIndex * 3.6 + 6.2 : "10px",
        },
      }}
    >
      {children}
    </MuiPopover>
  );
};
