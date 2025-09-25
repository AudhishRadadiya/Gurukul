import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, IconButton, ListItemButton, Typography } from "@mui/material";
import { type MouseEvent, useState } from "react";
import { PadBox } from "../../PadBox";
import { Popover } from "./Popover";

type AgGridActionColumn = {
  title: string;
  onClick: () => void;
};

type ActionColumnProps = {
  items: AgGridActionColumn[];
  disabled?: boolean;
};
export const ActionCell = ({ items, disabled }: ActionColumnProps) => {
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
        <MoreVertIcon />
      </IconButton>

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
