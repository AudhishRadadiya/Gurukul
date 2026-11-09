import {
  FormContainer,
  GridProvider,
  PhoneInputField,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack } from "@mui/material";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ImageUploadField } from "@web/components/common/ImageUploadField";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";
import { isValidMobileNumber } from "@web/utils/mobileNumberValidate";
import { emailRegex } from "@web/utils/regex";

const webUserMasterFormSchema = z.object({
  email: z
    .string()
    .trim()
    .regex(emailRegex, "common.email.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  father_name: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  hastak_mobile_no: z
    .string()
    .refine(isValidMobileNumber, {
      message: "common.mobileNumber.invalid",
    })
    .nullable(),
  hastak_name: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  is_active: z.boolean(),
  is_deleted: z.boolean(),
  // web_user_id: z.string().optional(),
  logo: z.string().nullable(),
  mobile_no: z
    .string()
    .refine(isValidMobileNumber, {
      message: "common.mobileNumber.invalid",
    })
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  // password: z.string().nullable().optional(),
  sur_name: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  your_name: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});
// .superRefine((data, ctx) => {
//   if (!data.web_user_id && !data.password) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: "common.required",
//       path: ["password"],
//     });
//   }
// });

export type WebUserMasterFormFieldValues = z.infer<
  typeof webUserMasterFormSchema
>;

export type WebUserMasterFormRef = {
  setError: ReturnType<
    typeof useForm<WebUserMasterFormFieldValues>
  >["setError"];
  submitForm: (
    onSubmit: (values: Partial<WebUserMasterFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: WebUserMasterFormFieldValues = {
  email: null,
  father_name: null,
  hastak_mobile_no: null,
  hastak_name: null,
  is_active: true,
  is_deleted: false,
  logo: null,
  mobile_no: null,
  sur_name: null,
  your_name: null,
};

type WebUserMasterFormProps = {
  defaultValues?: WebUserMasterFormFieldValues;
  loading?: boolean;
};

export const WebUserMasterForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      // isEditMode = false,
      loading = false,
    }: WebUserMasterFormProps,
    ref: ForwardedRef<WebUserMasterFormRef>
  ) => {
    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
    } = useForm({
      mode: "all",
      resolver: zodResolver(webUserMasterFormSchema),
      values: defaultValues,
    });

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          onSubmit(filterChangedFormFields(formValues, dirtyFields));
        })();
      },
    }));

    const {
      email,
      father_name,
      hastak_mobile_no,
      hastak_name,
      mobile_no,
      sur_name,
      your_name,
    } = errors;

    return (
      <FormContainer>
        <Stack gap={3}>
          <Stack
            direction={{ lg: "row", xs: "column" }}
            alignItems="flex-start"
            gap={3}
          >
            <Box sx={{ flexShrink: 0 }}>
              <ImageUploadField
                control={control}
                name="logo"
                loading={loading}
                label=""
              />
            </Box>

            <Stack gap={3} sx={{ flex: 1, minWidth: 0 }}>
              <GridProvider columns={3} gap={1}>
                <TextField
                  name="your_name"
                  control={control}
                  label={t("yourName.label")}
                  required
                  loading={loading}
                  error={!!your_name}
                  helperText={errorMessages(your_name?.message)}
                />
                <TextField
                  name="father_name"
                  control={control}
                  label={t("fatherName.label")}
                  required
                  loading={loading}
                  error={!!father_name}
                  helperText={errorMessages(father_name?.message)}
                />
                <TextField
                  name="sur_name"
                  control={control}
                  label={t("surname.label")}
                  required
                  loading={loading}
                  error={!!sur_name}
                  helperText={errorMessages(sur_name?.message)}
                />
              </GridProvider>

              <GridProvider columns={4} gap={1}>
                <PhoneInputField
                  name="mobile_no"
                  control={control}
                  label="Mobile Number"
                  required
                  loading={loading}
                  error={!!mobile_no}
                  helperText={errorMessages(mobile_no?.message)}
                />
                <TextField
                  name="email"
                  control={control}
                  label={t("email.label")}
                  letterCase="lowercase"
                  required
                  sx={{ marginTop: { lg: 2.8 } }}
                  loading={loading}
                  error={!!email}
                  helperText={errorMessages(email?.message)}
                />

                <PhoneInputField
                  name="hastak_mobile_no"
                  control={control}
                  label={t("hastak.mobileNumber.label")}
                  loading={loading}
                  error={!!hastak_mobile_no}
                  helperText={errorMessages(hastak_mobile_no?.message)}
                />

                <TextField
                  name="hastak_name"
                  control={control}
                  label={t("hastak.name.label")}
                  sx={{ marginTop: { lg: 2.8 } }}
                  loading={loading}
                  error={!!hastak_name}
                  helperText={errorMessages(hastak_name?.message)}
                />
                {/* <PasswordField
                  name="password"
                  letterCase="mixed"
                  control={control}
                  label="Password"
                  containerProps={{
                    mt: isNarrowMobile ? 0 : 2.8,
                  }}
                  required={!webUserId}
                  loading={loading}
                  error={!!password}
                  helperText={errorMessages(password?.message)}
                /> */}
              </GridProvider>
            </Stack>
          </Stack>

          <GridProvider columns={5} gap={5}>
            <RadioGroupField
              name="is_active"
              control={control}
              isHorizontal
              label="Is Active"
              loading={loading}
              options={[
                { disabled: false, label: t("common.yes"), values: true },
                { disabled: false, label: t("common.no"), values: false },
              ]}
            />

            <RadioGroupField
              name="is_deleted"
              control={control}
              isHorizontal
              label="Is Deleted"
              loading={loading}
              options={[
                { disabled: false, label: t("common.yes"), values: true },
                { disabled: false, label: t("common.no"), values: false },
              ]}
            />
          </GridProvider>
        </Stack>
      </FormContainer>
    );
  }
);

WebUserMasterForm.displayName = "WebUserMasterForm";
