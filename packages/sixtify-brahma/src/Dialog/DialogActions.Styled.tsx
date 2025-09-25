import { DialogActions } from "@mui/material";
import type { DialogActionsProps } from "@mui/material/DialogActions";
import { styled, type Theme } from "@mui/material/styles";

export const getDialogTheme = (theme: Theme) => ({
  padding: "16px 24px",

  [theme.breakpoints.up("xs")]: {
    padding: "10px",
  },
  [theme.breakpoints.up("sm")]: {
    padding: "16px 20px",
  },
  [theme.breakpoints.up("md")]: {
    padding: "16px 24px",
  },
});

export const StyledDialogActions: React.ComponentType<DialogActionsProps> =
  styled(DialogActions)(({ theme }) => ({
    ...getDialogTheme(theme),
  }));
