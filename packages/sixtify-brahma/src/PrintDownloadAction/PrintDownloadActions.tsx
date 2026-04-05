import { Box, ListItemButton, type SxProps, Typography } from "@mui/material";
import { type MouseEvent, useState } from "react";
import { DownloadPrintAction } from "../Actions";
import { Popover } from "../AgGrid/ActionCell/Popover";
import { PadBox } from "../PadBox";
import type { OnAction } from "../utils/types";

type PrintDownloadActionItems = {
  title: string;
  onClick: OnAction;
};

type PrintDownloadActionsProps = {
  sx?: SxProps;
  items: PrintDownloadActionItems[];
  disabled?: boolean;
};

export const PrintDownloadActions = ({
  items,
  disabled,
  sx,
}: PrintDownloadActionsProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const HandleClose = () => {
    setAnchorEl(null);
  };

  const HandleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <DownloadPrintAction onClick={HandleClick} disabled={disabled} />

      {!!anchorEl && (
        <Popover open={true} anchorEl={anchorEl} onClose={HandleClose}>
          <PadBox padding={{ padding: "2px" }}>
            {items.map((item) => {
              return (
                <Box key={item.title}>
                  <ListItemButton
                    sx={{ width: "100%", textAlign: "start" }}
                    onClick={() => {
                      item?.onClick();
                      setAnchorEl(null);
                    }}
                  >
                    <Typography variant="body1">{item.title}</Typography>
                  </ListItemButton>
                </Box>
              );
            })}
          </PadBox>
        </Popover>
      )}
    </Box>
  );
};
