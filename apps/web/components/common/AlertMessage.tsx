import type { AlertColor, AlertProps } from "@mui/material";
import { Alert, Typography } from "@mui/material";

type AlertMessageProps = AlertProps & {
  message?: string;
  severity?: AlertColor;
};

export const AlertMessage = ({
  message,
  severity = "success",
  ...props
}: AlertMessageProps) => {
  return (
    <Alert {...props} severity={severity}>
      <Typography variant="body1" fontWeight={500}>
        {message}
      </Typography>
    </Alert>
  );
};
