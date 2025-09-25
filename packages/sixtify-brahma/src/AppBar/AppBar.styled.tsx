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

  const width = open ? drawerWidth : collapsedWidth;

  return {
    background: theme.palette.app.color.iron[600],
    boxShadow: "unset",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),

    // ✅ Mobile: full width
    width: "100%",

    // ✅ Tablet & Desktop (collapsed drawer)
    [theme.breakpoints.up("sm")]: {
      marginLeft: `${collapsedWidth}px`,
      width: `calc(100% - ${width}px)`,
    },

    // ✅ When drawer is open
    ...(open && {
      marginLeft: drawerWidth,
      width: "calc(100% - 300px)",
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  };
});
