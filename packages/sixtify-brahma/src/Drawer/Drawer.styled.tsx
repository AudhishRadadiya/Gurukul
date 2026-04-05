import type {
  BoxProps,
  CSSObject,
  DrawerProps as MuiDrawerProps,
  Theme,
} from "@mui/material";
import { Box, Drawer as MuiDrawer, styled } from "@mui/material";
import type { ComponentType } from "react";

export const Bullet: ComponentType<BoxProps> = styled(Box)(({ theme }) => ({
  width: 7,
  height: 7,
  borderRadius: "50%",
  background: theme.palette.app.color.butterflyBlue[400],
}));

type StyledDrawerProps = MuiDrawerProps & {
  open?: boolean;
};

export const StyledDrawer: ComponentType<StyledDrawerProps> = styled(
  MuiDrawer,
  {
    shouldForwardProp: (prop) => prop !== "open",
  }
)(({ theme, open }) => {
  const drawerWidth = 300;

  const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    backgroundColor: theme.palette.app.color.mirage[900],
    [theme.breakpoints.down("md")]: {
      width: "80px",
    },
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: "0px",
    [theme.breakpoints.up("md")]: {
      width: "80px",
    },

    backgroundColor: theme.palette.app.color.mirage[900],
  });

  return {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  };
});
