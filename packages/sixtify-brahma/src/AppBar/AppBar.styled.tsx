import MuiAppBar, {
  type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import type { ComponentType } from "react";

type StyledAppBarProps = {
  open?: boolean;
} & MuiAppBarProps;

export const StyledAppBar: ComponentType<StyledAppBarProps> = styled(
  MuiAppBar,
  {
    shouldForwardProp: (prop) => prop !== "open",
  }
)<StyledAppBarProps>(({ theme, open }) => {
  const drawerWidth = 300;

  const collapsedWidth = 80;

  const mobileOffset = open ? collapsedWidth : 0;

  const desktopOffset = open ? drawerWidth : collapsedWidth;

  return {
    background: theme.palette.app.color.iron[600],
    boxShadow: "unset",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),

    width: "100%",

    [theme.breakpoints.down("md")]: {
      paddingLeft: "0px",
      paddingRight: "0px",
      marginLeft: `${mobileOffset}px`,
      width: `calc(100% - ${mobileOffset}px)`,
    },

    [theme.breakpoints.up("md")]: {
      paddingLeft: "0px",
      paddingRight: "0px",
      marginLeft: `${desktopOffset}px`,
      width: `calc(100% - ${desktopOffset}px)`,
    },

    ...(open && {
      marginLeft: "300px",
      width: "calc(100% - 300px)",
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  };
});
