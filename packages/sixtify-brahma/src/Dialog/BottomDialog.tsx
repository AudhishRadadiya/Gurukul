import { BottomDialogBody, BottomDialogStyled } from "./BottomDialog.styled";

import type { DialogProps } from ".";
import { PadBox } from "../PadBox";

export type BottomDialogProps = Omit<DialogProps, "title"> & {
  title?: string;
  open?: boolean;
  onClose: () => void;
};

export function BottomDialog({
  children,
  title,
  open = false,
  onClose,
  ...rest
}: BottomDialogProps) {
  return (
    <BottomDialogStyled
      fullScreen
      title={title}
      {...rest}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          animation: open ? "slideUp 0.2s cubic-bezier(0.25, 0.8, 0.5, 1)" : "",
        },
      }}
    >
      <BottomDialogBody direction="row" overflow="hidden">
        <PadBox padding={{ padding: "0.3rem" }}>{children}</PadBox>
      </BottomDialogBody>
    </BottomDialogStyled>
  );
}
