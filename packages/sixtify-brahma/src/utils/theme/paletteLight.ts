import { type PaletteOptions } from "@mui/material";
import { colorPalette } from "./colorPalette";

export const lightPalette: PaletteOptions = {
  common: {
    black: "hsla(0, 100%, 0%, 1)",
    white: "hsla(0, 100%, 100%, 1)",
  },
  primary: {
    main: colorPalette.mirage[900] as string,
    light: colorPalette.butterflyBlue[400],
  },
  secondary: {
    main: colorPalette.butterflyBlue[900] as string,
  },
  info: {
    main: colorPalette.slate[900] as string,
  },
  error: {
    main: colorPalette.red[900] as string,
  },
  warning: {
    main: colorPalette.darkOrange[900] as string,
  },
  app: {
    color: colorPalette,
    paperBoxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
  },
  divider: colorPalette.butterflyBlue[700],
};
