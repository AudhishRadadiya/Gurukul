import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import type { MenuProps } from "@mui/material";
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import _isFunction from "lodash/isFunction";
import {
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useGetDeviceType } from "../utils";
import type { OnAction } from "../utils/types";
import { IconButtonStyled } from "./UserProfileMenu.styled";

export type UserProfileMenuProps = Omit<MenuProps, "open" | "closeMenu"> & {
  userDetails: {
    name: string;
    avatar: string;
  };
  menuItems: {
    key: string;
    label: string;
    icon?: ReactNode;
    divider?: boolean;
    sx?: CSSProperties;
    onClick?: OnAction;
  }[];
};

export function UserProfileMenu({
  userDetails,
  menuItems,
}: UserProfileMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { layout } = useGetDeviceType();

  const isDesktop = layout === "desktop";

  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { name } = userDetails;

  return (
    <Box position="relative">
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <IconButtonStyled
          onClick={handleClick}
          size="small"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Stack direction="row" alignItems="center" gap={1} color="black">
            <Avatar
              src={userDetails.avatar}
              sx={{
                border: `1px solid ${iron[700]}`,
                width: { sm: "40px", xs: "30px" },
                height: { sm: "40px", xs: "30px" },
              }}
            />

            {isDesktop && (
              <>
                <Typography maxWidth={150} noWrap>
                  {name}
                </Typography>

                {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </>
            )}
          </Stack>
        </IconButtonStyled>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        sx={{
          "& .MuiPaper-root": {
            width: "220px",
          },
        }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: "''",
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {menuItems.map(
          ({ divider = false, onClick, icon, label, sx = {}, key }) => {
            return (
              <Box key={`${key}_container`}>
                {divider && <Divider />}

                <MenuItem
                  onClick={() => {
                    if (_isFunction(onClick)) {
                      onClick();
                    }
                  }}
                >
                  {(icon || label) && (
                    <Stack
                      gap="1px"
                      alignItems="center"
                      width="100%"
                      flexDirection="row"
                      sx={{ ...sx }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: "20px",
                          alignItems: "center",
                          ...sx,
                        }}
                      >
                        {icon}
                      </ListItemIcon>

                      {label && (
                        <Typography sx={{ fontSize: "15px" }}>
                          {label}
                        </Typography>
                      )}
                    </Stack>
                  )}
                </MenuItem>
              </Box>
            );
          }
        )}
      </Menu>
    </Box>
  );
}
