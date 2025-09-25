import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import type { ButtonProps as MuiButtonProps } from "@mui/material";
import {
  Button,
  CircularProgress,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";
export type ActionButtonProps = MuiButtonProps & {
  loading?: boolean;
};

export const ActionButton = ({
  loading = false,
  children,
  ...rest
}: ActionButtonProps) => {
  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  return (
    <Button {...rest}>
      <Stack gap="10px" flexDirection="row" alignItems="center">
        {loading ? <CircularProgress size={28} /> : children}
        <Divider
          orientation="vertical"
          sx={{
            borderColor: lightBlue[100],
            height: "22px",
          }}
        />
        <ExpandMoreRoundedIcon fontSize="small" />
      </Stack>
    </Button>
  );
};
