import type { ButtonProps as MuiButtonProps } from "@mui/material";
import { CircularProgress, Button as MuiButton } from "@mui/material";

export type ButtonProps = MuiButtonProps & {
  loading?: boolean;
};

export const Button = ({
  loading = false,
  children,
  disabled = false,
  ...rest
}: ButtonProps) => {
  return (
    <MuiButton disabled={loading || disabled} {...rest}>
      {loading ? <CircularProgress size={28} /> : children}
    </MuiButton>
  );
};
