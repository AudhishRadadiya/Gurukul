"use client";

import { Button, LogoIcon } from "@codezee/sixtify-brahma";
import { Alert, Stack, Typography, useTheme } from "@mui/material";
import { ArrowLeft } from "iconoir-react";
import Image from "next/image";
import { useState } from "react";

import { AuthUiCard } from "@web/components/auth/Layouts/AuthUiCard";
import { usePostTwoFactorEnable } from "@web/components/auth/sign-in/hooks/useGetTwoFactorEnable";
import type { ApiErrorResponse } from "@web/types/apiResponse";

type GoogleAuthSetupFormProps = {
  error: string;
  onBack: () => void;
  onContinue: () => void;
  setError: (error: string) => void;
  userId: string;
};

export const GoogleAuthSetupForm = ({
  error,
  onBack,
  onContinue,
  setError,
  userId,
}: GoogleAuthSetupFormProps) => {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const [qrCode, setQrCode] = useState<string>("");

  const { isPending, mutate: googleAuthSetupEnableMutate } =
    usePostTwoFactorEnable({
      options: {
        onError: (error: ApiErrorResponse) => {
          setError(error.response?.data?.message || "Failed generate qr code");
        },
        onSuccess: (data) => {
          setQrCode(data.qr_code);
        },
      },
    });

  const setupGoogleAuth = () => {
    googleAuthSetupEnableMutate(userId);
  };

  return (
    <AuthUiCard>
      <LogoIcon />

      <Stack gap={{ md: "70px", xs: "40px" }} width="100%">
        <Stack gap={{ md: "25px", xs: "15px" }} alignItems="center">
          <Typography
            variant="h3"
            fontWeight={600}
            sx={{
              fontSize: { md: "2.125rem", xs: "1.5rem" },
              textAlign: "center",
            }}
          >
            Setup Google Authenticator
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: iron[900],
              fontSize: { md: "1rem", xs: "0.875rem" },
              textAlign: "center",
            }}
          >
            Scan the QR code below with your Google Authenticator app
          </Typography>
        </Stack>

        <Stack gap="18px" alignItems="center">
          {error && <Alert severity="error">{error}</Alert>}

          {qrCode ? (
            <Stack gap="18px" alignItems="center">
              <Image
                src={qrCode}
                alt="Google Authenticator QR Code"
                width={200}
                height={200}
              />

              <Typography
                variant="body2"
                sx={{
                  color: iron[900],
                  fontSize: "0.75rem",
                  textAlign: "center",
                }}
              >
                After scanning the QR code, continue to enter the verification
                code
              </Typography>
            </Stack>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: iron[900],
                fontSize: "0.875rem",
                textAlign: "center",
              }}
            >
              Click the button below to generate your QR code for Google
              Authenticator setup
            </Typography>
          )}
        </Stack>
      </Stack>

      <Stack gap="12px" direction="row">
        <Button
          onClick={!qrCode ? setupGoogleAuth : onContinue}
          loading={isPending}
          sx={{
            fontSize: { md: "1rem", xs: "0.875rem" },
            minHeight: { md: "auto", xs: "48px" },
          }}
        >
          {!qrCode ? "Generate QR Code" : "Continue to Verification"}
        </Button>

        <Button
          startIcon={<ArrowLeft />}
          variant="outlined"
          onClick={onBack}
          disabled={isPending}
          sx={{
            fontSize: { md: "1rem", xs: "0.875rem" },
            minHeight: { md: "auto", xs: "48px" },
          }}
        >
          Back
        </Button>
      </Stack>
    </AuthUiCard>
  );
};
