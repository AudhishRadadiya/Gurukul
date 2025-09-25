"use client";

import { Button, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBack, MailOutlineOutlined } from "@mui/icons-material";
import { InputAdornment, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

import { ForgotPasswordSuccess } from "@web/components/auth/forgot-password/ForgotPasswordSuccess";
import { useForgotPassword } from "@web/components/auth/forgot-password/hook/useForgotPassword";
import { AuthUiCard } from "@web/components/auth/Layouts/AuthUiCard";
import { onError } from "@web/utils/errors";
import { emailRegex } from "@web/utils/regex";

const FormValuesSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "common.required" })
    .regex(emailRegex, "common.email.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type FormValuesTypes = z.infer<typeof FormValuesSchema>;

export const ForgotPasswordForm = () => {
  const router = useRouter();

  const { t } = useTranslation();

  const [isForgotPasswordSuccessPage, setIsForgotPasswordSuccessPage] =
    useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<FormValuesTypes>({
    defaultValues: {
      email: "",
    },
    mode: "all",
    resolver: zodResolver(FormValuesSchema),
  });

  const { isPending, mutate } = useForgotPassword({
    options: {
      onError: (error) => onError(error, setError),
      onSuccess: () => {
        setIsForgotPasswordSuccessPage(true);
      },
    },
  });

  const onSubmit = (formValues: FormValuesTypes) => {
    mutate(formValues);
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  if (isForgotPasswordSuccessPage) {
    return <ForgotPasswordSuccess />;
  }

  return (
    <AuthUiCard>
      <Stack gap="70px" width="100%">
        <Stack gap="32px">
          <ArrowBack
            sx={{ cursor: "pointer" }}
            onClick={() => {
              router.push("/auth/sign-in");
            }}
          />

          <Stack gap="8px">
            <Typography fontWeight={600} variant="h5">
              Forgot Password?
            </Typography>

            <Typography fontWeight={500} variant="body1">
              Reset instructions will be sent to your registered email.
            </Typography>
          </Stack>

          <TextField
            control={control}
            label="Email address"
            placeholder="Email address"
            name="email"
            required
            error={!!errors.email}
            helperText={errorMessages(errors.email?.message)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineOutlined fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Button
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
          loading={isPending}
        >
          Reset Password
        </Button>
      </Stack>
    </AuthUiCard>
  );
};
