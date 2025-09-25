import { ExpandLess, ExpandMore } from "@mui/icons-material";
import type { SxProps, Theme } from "@mui/material";
import { Box, useTheme } from "@mui/material";
import { Bullet } from "../Bullet";
import { MenuItem, type MenuItemProps } from "../MenuItem";

type OpenDrawerMenuItemProps = {
  icon?: MenuItemProps["icon"];
  title: MenuItemProps["title"];
  isShowEndAdornment?: boolean;
  selected?: MenuItemProps["selected"];
  onClick: MenuItemProps["onClick"];
  sx?: SxProps<Theme>;
  isExpanded?: boolean;
};

export const OpenDrawerMenuItem = ({
  icon = <Bullet />,
  title,
  isShowEndAdornment = false,
  selected = false,
  onClick,
  isExpanded,
  sx,
}: OpenDrawerMenuItemProps) => {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  return (
    <Box
      sx={{
        bgcolor: selected && !isShowEndAdornment ? butterflyBlue[900] : "",
      }}
    >
      <MenuItem
        sx={sx}
        title={title}
        icon={icon}
        onClick={onClick}
        selected={selected}
        endAdornment={
          isShowEndAdornment && (isExpanded ? <ExpandLess /> : <ExpandMore />)
        }
      />
    </Box>
  );
};
