import {
  AddCircleOutline,
  CheckCircleOutline,
  Close,
  ErrorOutline,
  HighlightOff,
} from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import type { ReactNode } from "react";
import { PadBox } from "../PadBox";
import type { ToastBodyProps } from "./ToastBody";
import { ToastBody } from "./ToastBody";
import type { ToastFooterLinkProps } from "./ToastFooterLink";
import { ToastFooterLink } from "./ToastFooterLink";
import type { ToastType } from "./types";

export type ToastProps = ToastBodyProps &
  ToastFooterLinkProps & {
    closeToast?: () => void;
    type: ToastType;
  };

type ToastIcon = {
  [K in ToastType]: ReactNode;
};

export const Toast = ({
  closeToast,
  type,
  title,
  description,
  href,
  linkText,
}: ToastProps) => {
  const toastIcons: ToastIcon = {
    info: <AddCircleOutline color="info" fontSize="large" />,
    success: <CheckCircleOutline color="success" fontSize="large" />,
    warning: <ErrorOutline color="warning" fontSize="large" />,
    error: <HighlightOff color="error" fontSize="large" />,
  };

  return (
    <PadBox padding={{ p: "20px", pl: "16px" }}>
      <Stack direction="row" gap="16px" alignItems="center">
        {toastIcons[type]}

        <Stack alignItems="flex-start" gap="1.2rem" flexGrow={1}>
          <ToastBody title={title} description={description} />

          {href && <ToastFooterLink href={href} linkText={linkText} />}
        </Stack>

        <IconButton onClick={closeToast} disableRipple>
          <Close />
        </IconButton>
      </Stack>
    </PadBox>
  );
};
