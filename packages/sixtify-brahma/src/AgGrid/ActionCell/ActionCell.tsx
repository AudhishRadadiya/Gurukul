import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, IconButton, ListItemButton, Typography } from "@mui/material";
import { type MouseEvent, useState } from "react";
import { PadBox } from "../../PadBox";
import { Popover } from "./Popover";
import type { OnAction } from "../../utils/types";
import { useGetDeviceType } from "../../utils/hooks/useGetDeviceType";

type AgGridActionColumn = {
  title: string;
  onClick: OnAction;
  disabled?: boolean;
};

type SmartGridActionItems = {
  href?: string;
  isView?: boolean;
  onClick?: OnAction;
  title: string;
  disabled?: boolean;
};

type ActionColumnProps = {
  items: AgGridActionColumn[] | SmartGridActionItems[];
  disabled?: boolean;
};

export const ActionCell = ({ items, disabled }: ActionColumnProps) => {
  const { isMobile } = useGetDeviceType();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const HandleClose = () => {
    setAnchorEl(null);
  };

  const HandleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <IconButton
        component="div"
        sx={{ cursor: "pointer", alignItems: "center", width: "100%" }}
        onClick={HandleClick}
        disabled={disabled}
      >
        <MoreVertIcon fontSize={isMobile ? "small" : "medium"} />
      </IconButton>

      {!!anchorEl && (
        <Popover open={true} anchorEl={anchorEl} onClose={HandleClose}>
          <PadBox padding={{ padding: "2px" }}>
            {items.map((item) => {
              return (
                <Box key={item.title}>
                  <ListItemButton
                    disabled={!!item.disabled}
                    sx={{ width: "100%", textAlign: "start" }}
                    onClick={() => {
                      item?.onClick?.();
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
