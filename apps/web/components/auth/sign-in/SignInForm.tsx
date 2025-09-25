"use client";

import {
  Button,
  LogoIcon,
  PasswordField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import {
  Alert,
  InputAdornment,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { AuthUiCard } from "@web/components/auth/Layouts/AuthUiCard";
import { passwordRegex } from "@web/utils/regex";

const FormValuesSchema = z.object({
  login_name: z
    .string()
    .trim()
    .min(1, { message: "common.required" })
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  password: z
    .string()
    .trim()
    .min(1, { message: "common.required" })
    .max(128, { message: "Password can`t be more than 128 characters" })
    .regex(
      passwordRegex,
      "Password must be alphanumeric and contain at-least 8 characters"
    )
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  rememberMe: z.boolean(),
});

export type FormValuesTypes = z.infer<typeof FormValuesSchema>;

export const SignInForm = () => {
  const [callBackUrl] = useQueryState("callbackUrl", {
    defaultValue: "/",
  });

  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const {
    palette: {
      app: { color },
    },
  } = useTheme();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValuesTypes>({
    defaultValues: {
      login_name: "",
      password: "",
      rememberMe: false,
    },
    mode: "all",
    resolver: zodResolver(FormValuesSchema),
  });

  const onSubmit = async (formValues: FormValuesTypes) => {
    setLoading(true);

    const result = await signIn("credentials", {
      callbackUrl: callBackUrl,
      login_name: formValues.login_name,
      password: formValues.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Incorrect credentials");
    } else if (result?.ok && result?.url) {
      window.location.href = result?.url;
    }
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  return (
    <Form control={control}>
      <AuthUiCard>
        <LogoIcon />

        <Stack
          gap={{
            // Mobile: smaller gap
            md: "70px",
            xs: "40px", // Desktop: original gap
          }}
          width="100%"
        >
          <Stack
            gap={{
              // Mobile: smaller gap
              md: "25px",
              xs: "15px", // Desktop: original gap
            }}
            alignItems="center"
          >
            <Typography
              variant="h4"
              fontWeight={600}
              sx={{
                fontSize: {
                  // Smaller font size on mobile
                  md: "2.125rem",
                  xs: "1.5rem", // Default h4 size on desktop
                },
              }}
            >
              Login
            </Typography>

            <Stack
              direction={{ sm: "row", xs: "column" }} // Stack vertically on mobile
              gap="5px"
              textAlign="center" // Center text on mobile
            >
              <Typography
                variant="body1"
                sx={{
                  color: color.iron[900],
                  fontSize: {
                    // Smaller font on mobile
                    md: "1rem",
                    xs: "0.875rem", // Default size on desktop
                  },
                }}
              >
                Welcome Back! Please Sign In to access
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: color.butterflyBlue[900],
                  fontSize: {
                    // Smaller font on mobile
                    md: "1rem",
                    xs: "0.875rem", // Default size on desktop
                  },
                }}
              >
                Smart Account.
              </Typography>
            </Stack>
          </Stack>

          <Stack gap="18px">
            {error && <Alert severity="error">Incorrect credentials</Alert>}

            <Stack gap="24px">
              <TextField
                control={control}
                label="Username"
                placeholder="Username"
                name="login_name"
                required
                error={!!errors.login_name}
                helperText={errorMessages(errors.login_name?.message)}
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
                placeholder="Password"
                required
                error={!!errors.password}
                helperText={errorMessages(errors.password?.message)}
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
          loading={loading}
          sx={{
            fontSize: {
              md: "1rem",
              xs: "0.875rem",
            },
            // Make button more mobile-friendly
            minHeight: {
              // Larger tap target on mobile
              md: "auto",
              xs: "48px",
            },
          }}
        >
          Sign In
        </Button>
      </AuthUiCard>
    </Form>
  );
};
