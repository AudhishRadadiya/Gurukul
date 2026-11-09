import {
  FormGridLayout,
  FormSection,
  PhoneInputField,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { isEmpty } from "lodash";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { FormProvider, useForm, type UseFormSetError } from "react-hook-form";
import { z } from "zod";

import { BranchAutocomplete } from "@web/components/common/Autocomplete/BranchAutocomplete";
import { ImageUploadField } from "@web/components/common/ImageUploadField";
import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { BankDetailList } from "@web/components/settings/trust-master/AddTrustMaster/BankDetail/BankDetailList/BankDetailList";
import { AddBankDetailDialog } from "@web/components/settings/trust-master/AddTrustMaster/BankDetail/Dialog/AddBankDetailDialog";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";
import {
  errorMessages,
  filterNestedChangedFormFields,
} from "@web/utils/helper";
import { isValidMobileNumber } from "@web/utils/mobileNumberValidate";
import { ifscRegex, panCardRegex } from "@web/utils/regex";

export const BankDetailFormSchema = z.object({
  acc_no: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  bank_branch: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  bank_name: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  ifsc_code: z
    .string()
    .trim()
    .regex(ifscRegex, "common.ifsc_code.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  is_active: z.boolean().nullable(),
});

const TrustMasterFormSchema = z.object({
  address: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  address_limit: z.number().nullable().optional(),
  allow_email: z.boolean().nullable(),
  allow_sms: z.boolean().nullable(),
  allow_whatsapp: z.boolean().nullable(),
  atg_image: z.string().nullable(),
  bank_detail: z.array(BankDetailFormSchema).nullable().optional(),
  branch_id: z.array(z.string()).default([]),
  cash_limit: z
    .number()
    .int()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  cheque_limit: z
    .number()
    .int()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  contact_no: z
    .string()
    .refine(isValidMobileNumber, {
      message: "common.mobileNumber.invalid",
    })
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  date_lock: z.boolean().nullable(),
  default_branch_id: z.array(z.string()).nullable().default([]),
  default_trust: z.boolean().nullable(),
  donation_collection_sms_no: z
    .string()
    .refine(isValidMobileNumber, {
      message: "common.mobileNumber.invalid",
    })
    .nullable()
    .optional(),
  is_active: z.boolean().nullable(),
  logo_image: z.string().nullable(),
  pan_image: z.string().nullable(),
  pan_number: z
    .string()
    .regex(panCardRegex, "common.pan_card_no.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  registration_no: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  short_name: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  sms_limit: z.number().nullable().optional(),
  trust_code: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  trust_name: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  trust_print_code: z
    .string()
    .regex(/^[A-Za-z]{2}$/, { message: "Must be exactly 2 letters" })
    .nullable()
    .optional(),
});

export type TrustMasterFormFieldValues = z.infer<typeof TrustMasterFormSchema>;

const formDefaultValues: TrustMasterFormFieldValues = {
  address: null,
  address_limit: null,
  allow_email: true,
  allow_sms: true,
  allow_whatsapp: true,
  atg_image: null,
  bank_detail: [],
  branch_id: [],
  cash_limit: null,
  cheque_limit: null,
  contact_no: null,
  date_lock: true,
  default_branch_id: [],
  default_trust: true,
  donation_collection_sms_no: null,
  is_active: true,
  logo_image: null,
  pan_image: null,
  pan_number: null,
  registration_no: null,
  short_name: null,
  sms_limit: null,
  trust_code: null,
  trust_name: null,
  trust_print_code: null,
};

type TrustMasterFormArgs = {
  defaultValues?: TrustMasterFormFieldValues;
  loading: boolean;
};

export type FormRef = {
  setError: UseFormSetError<TrustMasterFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<TrustMasterFormFieldValues>) => void
  ) => void;
};

export const TrustMasterForm = forwardRef(
  (
    { defaultValues = formDefaultValues, loading = false }: TrustMasterFormArgs,
    ref: ForwardedRef<FormRef>
  ) => {
    const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

    const methods = useForm({
      mode: "all",
      resolver: zodResolver(TrustMasterFormSchema),
      values: defaultValues,
    });

    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
      setValue,
      watch,
    } = methods;

    const bankDetailList = watch("bank_detail") || [];

    useImperativeHandle(ref, () => ({
      setError,

      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterNestedChangedFormFields(formValues, {
            ...dirtyFields,
            allow_email: true,
            allow_sms: true,
            allow_whatsapp: true,
            date_lock: true,
            default_trust: true,
            is_active: true,
          });

          const updatedFormValues = {
            ...filterFormValues,
            registration_no: filterFormValues.registration_no?.toUpperCase(),
            short_name: filterFormValues.short_name?.toUpperCase(),
            trust_code: filterFormValues.trust_code?.toUpperCase(),
            trust_name: filterFormValues.trust_name?.toUpperCase(),
            ...(filterFormValues.trust_print_code && {
              trust_print_code:
                filterFormValues.trust_print_code?.toUpperCase(),
            }),
          };

          onSubmit(updatedFormValues);
        })();
      },
    }));

    const dialogRenderer: DialogRenderer = {
      add: (
        <AddBankDetailDialog
          open
          onClose={onDialogClose}
          onAdd={(formValues) => {
            setValue("bank_detail", [...bankDetailList, formValues], {
              shouldDirty: true,
            });

            onDialogClose();
          }}
        />
      ),
    };

    const {
      address_limit,
      cash_limit,
      cheque_limit,
      contact_no,
      donation_collection_sms_no,
      pan_number,
      registration_no,
      short_name,
      sms_limit,
      trust_code,
      trust_name,
      trust_print_code,
    } = errors;

    return (
      <FormProvider {...methods}>
        <FormSection title="Trust Details">
          <FormGridLayout columns={3}>
            <ImageUploadField
              control={control}
              name="logo_image"
              loading={loading}
              label={t("common.image.label", {
                label: t("common.logo"),
              })}
            />

            <ImageUploadField
              control={control}
              name="pan_image"
              loading={loading}
              label={t("common.image.label", {
                label: t("common.pan"),
              })}
            />

            <ImageUploadField
              control={control}
              name="atg_image"
              loading={loading}
              label={t("common.image.label", {
                label: t("common.atg"),
              })}
            />

            <TextField
              name="trust_name"
              control={control}
              loading={loading}
              label={t("common.name.label", {
                label: t("trust.label"),
              })}
              letterCase="mixed"
              characterType="any-character"
              required
              setError={setError}
              error={!!trust_name}
              helperText={errorMessages(trust_name?.message)}
            />

            <TextField
              name="short_name"
              control={control}
              loading={loading}
              label={t("shortName.label")}
              required
              letterCase="mixed"
              characterType="any-character"
              setError={setError}
              error={!!short_name}
              helperText={errorMessages(short_name?.message)}
            />

            <TextField
              name="registration_no"
              control={control}
              loading={loading}
              label={t("registrationNo.label")}
              required
              letterCase="mixed"
              characterType="any-character"
              setError={setError}
              error={!!registration_no}
              helperText={errorMessages(registration_no?.message)}
            />

            <TextField
              name="trust_code"
              control={control}
              loading={loading}
              label={t("common.trust.code")}
              required
              letterCase="mixed"
              characterType="any-character"
              setError={setError}
              error={!!trust_code}
              helperText={errorMessages(trust_code?.message)}
            />

            <TextField
              type="number"
              required
              control={control}
              loading={loading}
              label={t("cashLimit.label")}
              name="cash_limit"
              setError={setError}
              error={!!cash_limit}
              helperText={errorMessages(cash_limit?.message)}
            />

            <TextField
              name="pan_number"
              control={control}
              label={t("panNumber.label")}
              required
              loading={loading}
              isCapitalize
              error={!!pan_number}
              helperText={errorMessages(pan_number?.message)}
            />

            <TextField
              type="number"
              required
              control={control}
              loading={loading}
              label={t("chequeLimit.label")}
              name="cheque_limit"
              setError={setError}
              error={!!cheque_limit}
              helperText={errorMessages(cheque_limit?.message)}
            />

            <PhoneInputField
              control={control}
              loading={loading}
              label={t("common.contact.label")}
              name="contact_no"
              required
              error={!!contact_no}
              helperText={errorMessages(contact_no?.message)}
            />

            <TextField
              type="number"
              control={control}
              loading={loading}
              label={t("addressLimit.label")}
              name="address_limit"
              setError={setError}
              error={!!address_limit}
              helperText={errorMessages(address_limit?.message)}
            />

            <TextField
              type="number"
              control={control}
              loading={loading}
              label={t("smsLimit.label")}
              name="sms_limit"
              setError={setError}
              error={!!sms_limit}
              helperText={errorMessages(sms_limit?.message)}
            />

            <PhoneInputField
              control={control}
              loading={loading}
              label={t("common.donation.collection.sms.no")}
              name="donation_collection_sms_no"
              error={!!donation_collection_sms_no}
              helperText={errorMessages(donation_collection_sms_no?.message)}
            />

            <TextField
              control={control}
              loading={loading}
              label={t("common.trust.print.code")}
              name="trust_print_code"
              letterCase="mixed"
              characterType="any-character"
              setError={setError}
              error={!!trust_print_code}
              helperText={errorMessages(trust_print_code?.message)}
            />

            <BranchAutocomplete
              loading={loading}
              name="branch_id"
              control={control}
              isUserWise
              multiple
            />

            <BranchAutocomplete
              isUserWise
              multiple
              loading={loading}
              label={t("branch.default.label")}
              name="default_branch_id"
              control={control}
            />

            <TextField
              name="address"
              control={control}
              loading={loading}
              label={t("address.label")}
              required
              multiline
              rows={4}
              letterCase="mixed"
              characterType="any-character"
              error={!!errors.address}
              helperText={errorMessages(errors.address?.message)}
              placeholder="Enter Address"
            />
          </FormGridLayout>

          <FormGridLayout columns={3}>
            <RadioGroupField
              name="date_lock"
              control={control}
              loading={loading}
              label={t("dateLock.label")}
              options={[
                {
                  disabled: false,
                  label: t("common.yes"),
                  values: true,
                },
                {
                  disabled: false,
                  label: t("common.no"),
                  values: false,
                },
              ]}
            />

            <RadioGroupField
              name="default_trust"
              control={control}
              loading={loading}
              label={t("defaultTrust.label")}
              options={[
                {
                  disabled: false,
                  label: t("common.yes"),
                  values: true,
                },
                {
                  disabled: false,
                  label: t("common.no"),
                  values: false,
                },
              ]}
            />

            <RadioGroupField
              name="is_active"
              control={control}
              loading={loading}
              label={t("isActive.label")}
              options={[
                {
                  disabled: false,
                  label: t("common.yes"),
                  values: true,
                },
                {
                  disabled: false,
                  label: t("common.no"),
                  values: false,
                },
              ]}
            />
          </FormGridLayout>

          <FormGridLayout columns={3}>
            <RadioGroupField
              name="allow_email"
              control={control}
              loading={loading}
              label={t("common.allow.label", {
                label: t("email.label"),
              })}
              options={[
                {
                  disabled: false,
                  label: t("common.yes"),
                  values: true,
                },
                {
                  disabled: false,
                  label: t("common.no"),
                  values: false,
                },
              ]}
            />

            <RadioGroupField
              name="allow_whatsapp"
              control={control}
              loading={loading}
              label={t("common.allow.label", {
                label: t("common.whatsApp.label"),
              })}
              options={[
                {
                  disabled: false,
                  label: t("common.yes"),
                  values: true,
                },
                {
                  disabled: false,
                  label: t("common.no"),
                  values: false,
                },
              ]}
            />

            <RadioGroupField
              name="allow_sms"
              control={control}
              loading={loading}
              label={t("common.allow.label", {
                label: t("sms.label"),
              })}
              options={[
                {
                  disabled: false,
                  label: t("common.yes"),
                  values: true,
                },
                {
                  disabled: false,
                  label: t("common.no"),
                  values: false,
                },
              ]}
            />
          </FormGridLayout>
        </FormSection>

        <Stack
          gap={1}
          marginTop={{ md: "16px", xs: "12px" }}
          paddingBottom={{ md: "16px", xs: "12px" }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={1}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {t("common.bank.detail.label")}
            </Typography>

            <ButtonLayoutProvider
              variant="outlined"
              disabled={loading}
              onClick={() => {
                onDialogOpen("add");
              }}
              label={t("common.button.add", {
                label: t("common.bank.detail.label"),
              })}
            />
          </Stack>

          {!isEmpty(bankDetailList) && (
            <Box sx={{ overflow: "hidden", width: "100%" }}>
              <BankDetailList
                setValue={setValue}
                bankDetailFormValues={bankDetailList}
              />
            </Box>
          )}
        </Stack>

        {openedDialog && dialogRenderer[openedDialog]}
      </FormProvider>
    );
  }
);

TrustMasterForm.displayName = "TrustMasterForm";
