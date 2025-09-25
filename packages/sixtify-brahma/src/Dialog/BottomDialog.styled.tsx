import type { StyledComponent } from "@emotion/styled";
import type { StackProps } from "@mui/material";
import { Stack, styled } from "@mui/material";
import type { DialogProps as MuiDialogProps } from "./Dialog";
import { Dialog } from "./Dialog";

export const BottomDialogStyled: StyledComponent<MuiDialogProps> = styled(
  Dialog
)({
  height: "85%",
  top: "auto",
  "& .MuiDialogContent-root": {
    display: "grid",
    padding: "unset",
  },
  "& .MuiDialog-paper": {
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
  },
});

export const BottomDialogBody: StyledComponent<StackProps> = styled(Stack)(
  () => ({
    "& > *": {
      flex: "1 1 auto",
    },
  })
);
