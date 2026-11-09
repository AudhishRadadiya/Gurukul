import { FormGridLayout, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { CityAutocomplete } from "@web/components/common/Autocomplete/CityAutocomplete";
import { StateAutocomplete } from "@web/components/common/Autocomplete/StateAutocomplete";
import type { DonationEntryFormFieldValues } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import { usePostCityAndStateFromPinCode } from "@web/hooks/address/usePostCityAndStateFromPinCode";
import { Debounce_Delay, errorMessages } from "@web/utils/helper";
import { emailRegex, panCardRegex, pinCodeRegex } from "@web/utils/regex";

export const BusinessDetailFormSchema = z.object({
  address: z.string().nullable(),
  business_detail_id: z.string().nullable().optional(),
  business_name: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  city: z.string().nullable().optional(),
  email: z
    .string()
    .regex(emailRegex, "common.email.invalid")
    .optional()
    .nullable(),
  pan: z
    .string()
    .regex(panCardRegex, "common.pan_card_no.invalid")
    .optional()
    .nullable(),
  pincode: z
    .string()
    .regex(pinCodeRegex, "common.pin_code.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  state: z.string().nullable().optional(),
});

export type BusinessDetailFormFieldValues = z.infer<
  typeof BusinessDetailFormSchema
>;

type BusinessDetailFormProps = {
  defaultValues?: BusinessDetailFormFieldValues;
};

export type FormRef = {
  setError: UseFormSetError<BusinessDetailFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: BusinessDetailFormFieldValues) => void
  ) => void;
};

const formDefaultValues: BusinessDetailFormFieldValues = {
  address: null,
  business_name: null,
  city: null,
  email: null,
  pan: null,
  pincode: null,
  state: null,
};

export const BusinessDetailForm = forwardRef(
  (
    { defaultValues = formDefaultValues }: BusinessDetailFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const formMethods = useForm({
      mode: "all",
      resolver: zodResolver(BusinessDetailFormSchema),
      values: defaultValues,
    });

    const {
      control,
      formState: { errors },
      handleSubmit,
      setError,
      setValue,
      watch,
    } = formMethods;

    const pincodeValue = watch("pincode");

    const [pincodeInput] = useDebounceValue(pincodeValue, Debounce_Delay);

    const { data: locationData } = usePostCityAndStateFromPinCode({
      pinCode: !errors.pincode && pincodeInput ? pincodeInput : "",
    });

    const isLocationFromPincode = useMemo(
      () =>
        !!pincodeValue &&
        pincodeValue === pincodeInput &&
        !errors.pincode &&
        !!locationData?.city &&
        !!locationData.state,
      [
        errors.pincode,
        locationData?.city,
        locationData?.state,
        pincodeValue,
        pincodeInput,
      ]
    );

    const { city, state } = useMemo<
      Pick<DonationEntryFormFieldValues, "city" | "state">
    >(() => {
      return {
        city: locationData?.city ?? null,
        state: locationData?.state ?? null,
      };
    }, [locationData]);

    useEffect(() => {
      if (!pincodeValue) {
        setValue("city", null, { shouldValidate: true });
        setValue("state", null, { shouldValidate: true });

        return;
      }

      if (pincodeValue !== pincodeInput || errors.pincode || !locationData) {
        return;
      }

      setValue("city", city ?? null, { shouldValidate: true });
      setValue("state", state ?? null, { shouldValidate: true });
    }, [
      city,
      errors.pincode,
      locationData,
      pincodeValue,
      pincodeInput,
      setValue,
      state,
    ]);

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          onSubmit({ business_detail_id: uuidv4(), ...formValues });
        })();
      },
    }));

    const { business_name, email, pan, pincode } = errors;

    return (
      <FormProvider {...formMethods}>
        <Stack gap="16px">
          <FormGridLayout columns={2}>
            <TextField
              name="business_name"
              control={control}
              required
              label={t("common.business.name")}
              error={!!business_name}
              helperText={errorMessages(business_name?.message)}
            />

            <TextField
              name="pan"
              control={control}
              label={t("panNumber.label")}
              error={!!pan}
              helperText={errorMessages(pan?.message)}
            />
          </FormGridLayout>

          <FormGridLayout columns={2}>
            <TextField
              name="email"
              control={control}
              label={t("email.label")}
              letterCase="lowercase"
              error={!!email}
              helperText={errorMessages(email?.message)}
            />

            <TextField
              name="pincode"
              control={control}
              label={t("common.pincode")}
              required
              maxLength={6}
              setError={setError}
              error={!!pincode}
              helperText={errorMessages(pincode?.message)}
            />
          </FormGridLayout>

          <FormGridLayout columns={2}>
            <CityAutocomplete
              name="city"
              control={control}
              disabled={isLocationFromPincode}
              error={!!errors.city}
              helperText={errorMessages(errors.city?.message)}
            />

            <StateAutocomplete
              name="state"
              control={control}
              disabled={isLocationFromPincode}
              error={!!errors.state}
              helperText={errorMessages(errors.state?.message)}
            />
          </FormGridLayout>

          <FormGridLayout columns={1}>
            <TextField
              name="address"
              control={control}
              multiline
              letterCase="mixed"
              characterType="any-character"
              label={t("address.label")}
            />
          </FormGridLayout>
        </Stack>
      </FormProvider>
    );
  }
);

BusinessDetailForm.displayName = "BusinessDetailForm";
