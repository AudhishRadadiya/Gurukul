"use client";

import { Button, PasswordField, toasts } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

import type { FormValuesTypes } from "@web/app/auth/reset-password/page";
import { useChangePassword } from "@web/app/change-password/hook/useChangePassword";
import { AuthUiCard } from "@web/components/auth/Layouts/AuthUiCard";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";
import { errorMessages } from "@web/utils/helper";
import { passwordRegex } from "@web/utils/regex";

const ChangePasswordFormSchema = z
  .object({
    confirm_password: z
      .string()
      .trim()
      .min(1, { message: "common.required" })
      .max(128, { message: "common.max" })
      .regex(passwordRegex, "common.password.regex")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    old_password: z
      .string()
      .trim()
      .min(1, { message: "common.required" })
      .max(128, { message: "common.max" })
      .regex(passwordRegex, "common.password.regex")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    password: z
      .string()
      .trim()
      .min(1, { message: "common.required" })
      .max(128, { message: "common.max" })
      .regex(passwordRegex, "common.password.regex")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
  })
  .refine((values) => values.password === values.confirm_password, {
    message: "common.password.not.matched",
    path: ["confirm_password"],
  });

export type ChangePasswordFormFieldValues = z.infer<
  typeof ChangePasswordFormSchema
>;

const defaultValues: ChangePasswordFormFieldValues = {
  confirm_password: null,
  old_password: null,
  password: null,
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ChangePasswordFormFieldValues>({
    mode: "all",
    resolver: zodResolver(ChangePasswordFormSchema),
    values: defaultValues,
  });

  const router = useRouter();

  useEnableDisableButton<ChangePasswordFormFieldValues>({
    control,
    defaultValues,
    errors,
  });

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useChangePassword({
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/");
      },
    },
  });

  const onSubmit = (formValues: FormValuesTypes) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirm_password, ...updatedFormValues } = formValues;

    mutate(updatedFormValues);
  };

  const { confirm_password, old_password, password } = errors;

  return (
    <Stack
      height="calc(110vh - 223px)"
      alignItems="center"
      justifyContent="center"
    >
      <AuthUiCard>
        <Stack gap="70px" width="100%">
          <Stack gap="32px">
            <Typography fontWeight={600} variant="h5">
              {t("change.password.menu.label")}
            </Typography>

            <PasswordField
              name="old_password"
              label={t("old.password.label")}
              letterCase="mixed"
              control={control}
              error={!!old_password}
              helperText={errorMessages(old_password?.message)}
              required
            />

            <PasswordField
              name="password"
              label={t("new.password.label")}
              letterCase="mixed"
              control={control}
              error={!!password}
              helperText={errorMessages(password?.message)}
              required
            />

            <PasswordField
              name="confirm_password"
              label={t("confirm.password.label")}
              control={control}
              letterCase="mixed"
              error={!!confirm_password}
              helperText={errorMessages(confirm_password?.message)}
              required
            />
          </Stack>

          <Button
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
            loading={isPending}
            disabled={isDisabled()}
          >
            Update Password
          </Button>
        </Stack>
      </AuthUiCard>
    </Stack>
  );
}
