import type { CSSObject, IconButtonProps, MenuProps } from "@mui/material";

import { IconButton, Menu, menuClasses } from "@mui/material";

import { styled } from "@mui/material/styles";
import type { ComponentType } from "react";

export const MenuStyled: ComponentType<MenuProps> = styled(Menu)(({
  theme,
}) => {
  const style: CSSObject = {
    [`& .${menuClasses.paper}`]: {
      boxShadow: theme.palette.app.paperBoxShadow,
      minWidth: "29rem",
      width: "auto",
      margin: "0 0.5rem",
      borderRadius: "8px",
      overflow: "visible",
      "& .MuiList-root": {
        padding: "0",
        overflow: "visible",
      },
    },
  };

  return style;
});

export const IconButtonStyled: ComponentType<IconButtonProps> = styled(
  IconButton,
  {
    shouldForwardProp: (prop) => prop !== "isOpened",
  }
)<{ isOpened?: boolean }>(() => {
  const style: CSSObject = {
    paddingInline: "0.3rem",
    paddingBlock: "0.2rem",
    borderRadius: "8px",
  };

  return style;
});
