import { Button, LogoIcon, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Stack, Typography, useTheme } from "@mui/material";
import { ArrowLeft } from "iconoir-react";
import React from "react";
import { Form, useForm } from "react-hook-form";

import { AuthUiCard } from "@web/components/auth/Layouts/AuthUiCard";
import type { OTPFormFieldValues } from "@web/components/auth/sign-in/hooks/authSchema";
import { OTPSchema } from "@web/components/auth/sign-in/hooks/authSchema";
import { errorMessages } from "@web/utils/helper";

type OTPFormProps = {
  error: string;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (otpValues: OTPFormFieldValues) => void;
};

export const OTPForm: React.FC<OTPFormProps> = ({
  error,
  isLoading,
  onBack,
  onSubmit,
}) => {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<OTPFormFieldValues>({
    defaultValues: { code: "" },
    mode: "all",
    resolver: zodResolver(OTPSchema),
  });

  const { code } = errors;

  return (
    <Form control={control}>
      <AuthUiCard>
        <LogoIcon />

        <Stack gap={{ md: "70px", xs: "40px" }} width="100%">
          <Stack gap={{ md: "25px", xs: "15px" }} alignItems="center">
            <Typography
              variant="h3"
              fontWeight={600}
              sx={{
                fontSize: { md: "1.8rem", xs: "1.5rem" },
                textAlign: "center",
              }}
            >
              Verify OTP
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: iron[900],
                fontSize: { md: "1rem", xs: "0.875rem" },
                textAlign: "center",
              }}
            >
              Enter the OTP sent to your registered device
            </Typography>
          </Stack>

          <Stack gap="18px">
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              control={control}
              label="Enter OTP"
              placeholder="Enter 4-6 digit OTP"
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
            Verify OTP
          </Button>

          <Button
            variant="outlined"
            startIcon={<ArrowLeft />}
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
