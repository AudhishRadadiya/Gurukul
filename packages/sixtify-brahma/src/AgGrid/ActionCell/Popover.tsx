import type { PopoverProps } from "@mui/material";
import { Popover as MuiPopover } from "@mui/material";

export const Popover = ({
  open,
  anchorEl,
  children,
  onClose,
}: PopoverProps) => {
  return (
    <MuiPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        "& .MuiPaper-root": {
          width: "auto",
        },
      }}
    >
      {children}
    </MuiPopover>
  );
};
