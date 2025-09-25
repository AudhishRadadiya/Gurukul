import { FormContainer, FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DonationModeAutocomplete } from "@web/components/common/Autocomplete/DonationModeAutocomplete";
import { useGetReceiptNumber } from "@web/components/common/Autocomplete/hooks/useGetReceiptNumber";
import { TrustAutocomplete } from "@web/components/common/Autocomplete/TrustAutocomplete";
import { UserAutocomplete } from "@web/components/common/Autocomplete/UserAutocomplete";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const CancelReceiptFromSchema = z.object({
  donation_mode_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  receipt_number: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  total_receipt: z
    .number()
    .min(1)
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  trust_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  user_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type CancelReceiptFormFieldValues = z.infer<
  typeof CancelReceiptFromSchema
>;

type CancelReceiptFormProps = {
  defaultValues?: CancelReceiptFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<CancelReceiptFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<CancelReceiptFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: CancelReceiptFormFieldValues = {
  donation_mode_id: null,
  receipt_number: null,
  total_receipt: null,
  trust_id: null,
  user_id: null,
};

export const CancelReceiptFrom = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: CancelReceiptFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      clearErrors,
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
      setValue: setFieldValue,
      watch,
    } = useForm({
      mode: "all",
      resolver: zodResolver(CancelReceiptFromSchema),
      values: defaultValues,
    });

    const trustId = watch("trust_id");

    const donationModeId = watch("donation_mode_id");

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(
            formValues,
            dirtyFields
          );

          onSubmit(filterFormValues);
        })();
      },
    }));

    const { data } = useGetReceiptNumber({
      donation_mode_id: donationModeId ?? "",
      trust_id: trustId ?? "",
    });

    const generatedReceiptNumber = data?.receipt_number ?? "";

    useMemo(() => {
      if (data) {
        setFieldValue("receipt_number", generatedReceiptNumber, {
          shouldDirty: true,
        });

        clearErrors("receipt_number");
      } else {
        setFieldValue("receipt_number", "");
      }
    }, [data]);

    const {
      donation_mode_id,
      receipt_number,
      total_receipt,
      trust_id,
      user_id,
    } = errors;

    return (
      <FormContainer>
        <FormRow maxColumn={2}>
          <TrustAutocomplete
            loading={loading}
            name="trust_id"
            control={control}
            required
            error={!!trust_id}
            helperText={errorMessages(trust_id?.message)}
          />

          <DonationModeAutocomplete
            loading={loading}
            name="donation_mode_id"
            control={control}
            required
            error={!!donation_mode_id}
            helperText={errorMessages(donation_mode_id?.message)}
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <TextField
            control={control}
            loading={loading}
            isCapitalize
            label={t("common.receipt.label", {
              label: t("common.number.label"),
            })}
            name="receipt_number"
            disabled
            required
            error={!!receipt_number}
            helperText={errorMessages(receipt_number?.message)}
          />

          <TextField
            control={control}
            type="number"
            loading={loading}
            name="total_receipt"
            label={t("totalReceipt.label")}
            required
            error={!!total_receipt}
            helperText={errorMessages(total_receipt?.message)}
          />
        </FormRow>

        <FormRow maxColumn={1}>
          <UserAutocomplete
            loading={loading}
            name="user_id"
            control={control}
            required
            error={!!user_id}
            helperText={errorMessages(user_id?.message)}
          />
        </FormRow>
      </FormContainer>
    );
  }
);

CancelReceiptFrom.displayName = "CancelReceiptFrom";
