import { ArrowLeft } from "@mui/icons-material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  DialogTitle,
  IconButton,
  Dialog as MuiDialog,
  Stack,
  Typography,
  type DialogProps as MuiDialogProps,
} from "@mui/material";
import type { KeyboardEvent, PropsWithChildren, ReactNode } from "react";
import { useGetDeviceType } from "../utils";
import { StyledDialogActions } from "./DialogActions.Styled";
import { StyledDialogContent } from "./DialogContent.Styled";

export type DialogProps = PropsWithChildren<
  MuiDialogProps & {
    isHideCloseIcon?: boolean;
    title?: string;
    backTitle?: string;
    onBack?: () => void;
    actions?: ReactNode;
    isHideDividers?: boolean;
  }
>;

export const Dialog = ({
  title,
  backTitle,
  onBack,
  isHideCloseIcon = false,
  isHideDividers = false,
  children,
  onClose,
  actions,
  ...props
}: DialogProps) => {
  const { layout } = useGetDeviceType();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && onClose) {
      onClose(event, "escapeKeyDown");
    }
  };

  return (
    <MuiDialog fullWidth onKeyDown={handleKeyDown} {...props}>
      <DialogTitle
        padding={{
          xs: "10px",
          sm: "16px 20px",
          md: "16px 24px",
        }}
        textAlign="center"
      >
        <Stack direction="row" alignItems="center">
          {backTitle && (
            <Stack direction="row" alignItems="center" gap="15px">
              <ArrowLeft
                width={20}
                height={18}
                style={{ cursor: "pointer" }}
                onClick={onBack}
              />
              <Typography variant="h6" fontWeight={500} fontSize={17} flex={1}>
                {backTitle}
              </Typography>
            </Stack>
          )}
          {typeof title === "string" ? (
            <Typography variant="h5" fontWeight={500} flex={1}>
              {title}
            </Typography>
          ) : (
            title
          )}

          {!isHideCloseIcon && (
            <IconButton
              onClick={(event) => onClose && onClose(event, "escapeKeyDown")}
              color="secondary"
              size="small"
            >
              <HighlightOffIcon
                fontSize={layout === "desktop" ? "large" : "medium"}
              />
            </IconButton>
          )}
        </Stack>
      </DialogTitle>

      <StyledDialogContent dividers={!isHideDividers}>
        {children}
      </StyledDialogContent>

      {actions && <StyledDialogActions>{actions}</StyledDialogActions>}
    </MuiDialog>
  );
};
