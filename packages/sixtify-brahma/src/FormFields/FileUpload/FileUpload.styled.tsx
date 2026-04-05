import type { BoxProps } from "@mui/material";
import { Box, styled } from "@mui/material";
import type {
  ComponentType,
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
} from "react";

export type FileUploadContainerProps = BoxProps & {
  error?: boolean;
  disabled?: boolean;
  children: ReactNode;
};

export const FileUploadContainer: ComponentType<FileUploadContainerProps> =
  styled(Box)<FileUploadContainerProps>(({ theme, error, disabled }) => ({
    border: error
      ? `2px dashed ${theme.palette.app.color.red[900]}`
      : `2px dashed ${theme.palette.app.color.iron[800]}`,
    borderRadius: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    "&:hover": {
      borderColor: disabled
        ? theme.palette.app.color.iron[800]
        : theme.palette.app.color.butterflyBlue[900],
    },
  }));

export const FileInput: ComponentType<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = styled("input")({
  display: "none",
});
