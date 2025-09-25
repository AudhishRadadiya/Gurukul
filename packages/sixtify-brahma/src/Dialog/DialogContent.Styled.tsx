import { DialogContent, type DialogContentProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { getDialogTheme } from "./DialogActions.Styled";

export const StyledDialogContent: React.ComponentType<DialogContentProps> =
  styled(DialogContent)(({ theme }) => ({
    ...getDialogTheme(theme),
  }));
