"use client";

import { Button, LogoIcon } from "@codezee/sixtify-brahma";
import { Smartphone } from "@mui/icons-material";
import { Alert, CardContent, Stack, Typography, useTheme } from "@mui/material";
import { ArrowLeft, Shield } from "iconoir-react";

import { AuthUiCard } from "@web/components/auth/Layouts/AuthUiCard";

type AuthMethodSelectionFormProps = {
  error: string;
  hasGoogleAuth: boolean;
  hasOTP: boolean;
  onBack: () => void;
  onSelect: (method: "OTP" | "GOOGLE_AUTH") => void;
};

export const AuthMethodSelectionForm = ({
  error,
  hasGoogleAuth,
  hasOTP,
  onBack,
  onSelect,
}: AuthMethodSelectionFormProps) => {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  return (
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
          Choose Authentication Method
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: iron[900],
            fontSize: { md: "1rem", xs: "0.875rem" },
            textAlign: "center",
          }}
        >
          Select your preferred method to secure your account
        </Typography>

        <CardContent>
          {error && <Alert severity="error">{error}</Alert>}

          <Stack direction="row" gap="12px">
            {hasOTP && (
              <Button variant="outlined" onClick={() => onSelect("OTP")}>
                <Smartphone />
                <Stack>
                  <Typography>SMS OTP</Typography>

                  <Typography>Receive a code via SMS</Typography>
                </Stack>
              </Button>
            )}

            {hasGoogleAuth && (
              <Button
                variant="outlined"
                onClick={() => onSelect("GOOGLE_AUTH")}
              >
                <Shield />

                <Stack>
                  <Typography>Use your</Typography>
                  <Typography>Google authenticator app</Typography>
                </Stack>
              </Button>
            )}
          </Stack>
        </CardContent>

        <Button startIcon={<ArrowLeft />} variant="outlined" onClick={onBack}>
          Back to Login
        </Button>
      </Stack>
    </AuthUiCard>
  );
};
