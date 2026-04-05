import { Button, PasswordField, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import {
  Alert,
  InputAdornment,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";

import { AuthUiCard } from "@web/components/auth/Layouts/AuthUiCard";
import type { LoginFormFieldValues } from "@web/components/auth/sign-in/hooks/authSchema";
import { LoginFormValuesSchema } from "@web/components/auth/sign-in/hooks/authSchema";
import { AppLogo } from "@web/components/Drawer/AppLogo";
import { errorMessages } from "@web/utils/helper";

type LoginFormProps = {
  error: string;
  isLoading: boolean;
  onSubmit: (formValues: LoginFormFieldValues) => void;
};

export const LoginForm = ({ error, isLoading, onSubmit }: LoginFormProps) => {
  const theme = useTheme();

  const { butterflyBlue, iron } = theme.palette.app.color;

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFormFieldValues>({
    defaultValues: {
      login_name: "",
      password: "",
    },
    mode: "all",
    resolver: zodResolver(LoginFormValuesSchema),
  });

  const { login_name, password } = errors;

  return (
    <AuthUiCard>
      <AppLogo size="large" />

      <Stack gap={{ md: "70px", xs: "40px" }} width="100%">
        <Stack gap={{ md: "25px", xs: "15px" }} alignItems="center">
          <Typography
            variant="h4"
            fontWeight={600}
            sx={{
              fontSize: { md: "2.125rem", xs: "1.5rem" },
            }}
          >
            Login
          </Typography>

          <Stack
            direction={{ sm: "row", xs: "column" }}
            gap="5px"
            textAlign="center"
          >
            <Typography
              variant="body1"
              sx={{
                color: iron[900],
                fontSize: { md: "1rem", xs: "0.875rem" },
              }}
            >
              Welcome Back! Please Sign In to access
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: butterflyBlue[900],
                fontSize: { md: "1rem", xs: "0.875rem" },
              }}
            >
              Smart Account.
            </Typography>
          </Stack>
        </Stack>

        <Stack gap="18px">
          {error && <Alert severity="error">{error}</Alert>}

          <Stack gap="24px">
            <TextField
              control={control}
              label="Username"
              letterCase="mixed"
              placeholder="Username"
              name="login_name"
              required
              error={!!login_name}
              helperText={errorMessages(login_name?.message)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <PasswordField
              control={control}
              label="Password"
              name="password"
              letterCase="mixed"
              placeholder="Password"
              required
              error={!!password}
              helperText={errorMessages(password?.message)}
            />
          </Stack>
        </Stack>
      </Stack>

      <Button
        type="submit"
        onClick={() => {
          handleSubmit(onSubmit)();
        }}
        fullWidth
        loading={isLoading}
        sx={{
          fontSize: { md: "1rem", xs: "0.875rem" },
          minHeight: { md: "auto", xs: "48px" },
        }}
      >
        Sign In
      </Button>
    </AuthUiCard>
  );
};
