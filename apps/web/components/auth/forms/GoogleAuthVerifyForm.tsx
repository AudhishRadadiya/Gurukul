"use client";

import { Button, LogoIcon, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Stack, Typography, useTheme } from "@mui/material";
import { ArrowLeft } from "iconoir-react";
import { Form, useForm } from "react-hook-form";

import { AuthUiCard } from "@web/components/auth/Layouts/AuthUiCard";
import type { GoogleAuthFormFieldValues } from "@web/components/auth/sign-in/hooks/authSchema";
import { GoogleAuthSchema } from "@web/components/auth/sign-in/hooks/authSchema";
import { errorMessages } from "@web/utils/helper";

type GoogleAuthVerifyFormProps = {
  error: string;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (formValues: GoogleAuthFormFieldValues) => void;
};

export const GoogleAuthVerifyForm = ({
  error,
  isLoading,
  onBack,
  onSubmit,
}: GoogleAuthVerifyFormProps) => {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<GoogleAuthFormFieldValues>({
    defaultValues: {
      code: "",
    },
    mode: "all",
    resolver: zodResolver(GoogleAuthSchema),
  });

  const { code } = errors;

  return (
    <Form control={control}>
      <AuthUiCard>
        <LogoIcon />

        <Stack gap={{ md: "70px", xs: "40px" }} width="100%">
          <Typography
            variant="h3"
            fontWeight={600}
            sx={{
              fontSize: { md: "1.8rem", xs: "1.5rem" },
              textAlign: "center",
            }}
          >
            Verify Google Authenticator
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: iron[900],
              fontSize: { md: "1rem", xs: "0.875rem" },
              textAlign: "center",
            }}
          >
            Enter the 6-digit code from your Google Authenticator app
          </Typography>

          <Stack gap="18px">
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              control={control}
              label="Enter Google Auth Code"
              placeholder="Enter 6-digit code"
              name="code"
              required
              error={!!code}
              helperText={errorMessages(code?.message)}
              autoFocus
            />
          </Stack>
        </Stack>

        <Stack direction="row" gap="12px">
          <Button
            type="submit"
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
            loading={isLoading}
            sx={{
              fontSize: { md: "1rem", xs: "0.875rem" },
              minHeight: { md: "auto", xs: "48px" },
            }}
          >
            Verify Code
          </Button>

          <Button
            startIcon={<ArrowLeft />}
            variant="outlined"
            onClick={onBack}
            disabled={isLoading}
            sx={{
              fontSize: { md: "1rem", xs: "0.875rem" },
              minHeight: { md: "auto", xs: "48px" },
            }}
          >
            Back
          </Button>
        </Stack>
      </AuthUiCard>
    </Form>
  );
};
