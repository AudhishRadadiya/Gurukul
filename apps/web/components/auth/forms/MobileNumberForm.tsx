"use client";

import { Button, LogoIcon, PhoneInputField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Stack, Typography, useTheme } from "@mui/material";
import { ArrowLeft } from "iconoir-react";
import React from "react";
import { Form, useForm } from "react-hook-form";

import { AuthUiCard } from "@web/components/auth/Layouts/AuthUiCard";
import type { MobileNumberFormFieldValues } from "@web/components/auth/sign-in/hooks/authSchema";
import { MobileNumberSchema } from "@web/components/auth/sign-in/hooks/authSchema";
import { errorMessages } from "@web/utils/helper";

type MobileNumberFormProps = {
  error: string;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (values: MobileNumberFormFieldValues) => void;
};

export const MobileNumberForm: React.FC<MobileNumberFormProps> = ({
  error,
  isLoading = false,
  onBack,
  onSubmit,
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<MobileNumberFormFieldValues>({
    defaultValues: { mobile_number: "" },
    mode: "all",
    resolver: zodResolver(MobileNumberSchema),
  });

  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const { mobile_number } = errors;

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
              Verify Your Mobile Number
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: iron[900],
                fontSize: { md: "1rem", xs: "0.875rem" },
                textAlign: "center",
              }}
            >
              Enter Mobile Number (to link account)
            </Typography>
          </Stack>

          <Stack gap="18px">
            {error && <Alert severity="error">{error}</Alert>}

            <PhoneInputField
              control={control}
              required
              label="Mobile Number"
              name="mobile_number"
              error={!!mobile_number}
              helperText={errorMessages(mobile_number?.message)}
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
