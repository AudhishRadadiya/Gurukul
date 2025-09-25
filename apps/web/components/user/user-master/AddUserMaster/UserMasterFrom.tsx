import {
  DatePicker,
  FormContainer,
  FormGridLayout,
  PasswordField,
  PhoneInputField,
  RadioGroupField,
  TextField,
  TimePicker,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AddressTypeAutocomplete } from "@web/components/common/Autocomplete/AddressTypeAutocomplete";
import { BranchAutocomplete } from "@web/components/common/Autocomplete/BranchAutocomplete";
import { EventAutocomplete } from "@web/components/common/Autocomplete/EventAutocomplete";
import { FinancialYearAutocomplete } from "@web/components/common/Autocomplete/FinancialYearAutocomplete";
import { TrustAutocomplete } from "@web/components/common/Autocomplete/TrustAutocomplete";
import { UserTypeAutocomplete } from "@web/components/common/Autocomplete/UserTypeAutocomplete";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";
import { isValidMobileNumber } from "@web/utils/mobileNumberValidate";
import { emailRegex, passwordRegex } from "@web/utils/regex";

const UserMasterFromSchema = z.object({
  address_type_id: z
    .array(z.string())
    .min(1, { message: "common.required" })
    .default([]),
  allow_donation_day: z.boolean().optional(),
  allow_donation_login: z.boolean().optional(),
  allow_print_export: z.boolean().optional(),
  branch_id: z
    .array(z.string())
    .min(1, { message: "common.required" })
    .default([]),
  closed_time: z.string().nullable(),
  contact_no: z
    .string()
    .refine(isValidMobileNumber, {
      message: "common.mobileNumber.invalid",
    })
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  donation_day: z.number().nullable(),
  donation_edit: z.boolean().optional(),
  donation_edit_from_date: z.string().nullable().optional(),
  donation_edit_to_date: z.string().nullable().optional(),
  donation_view_from_date: z.string().nullable(),
  email: z
    .string()
    .trim()
    .regex(emailRegex, "common.email.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  enable_two_factor: z.boolean().optional(),
  event_id: z
    .array(z.string())
    .min(1, { message: "common.required" })
    .default([]),
  financial_year_id: z
    .array(z.string())
    .min(1, { message: "common.required" })
    .default([]),
  full_name: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  full_permission: z.boolean().optional(),
  is_active: z.boolean().optional(),
  login_name: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  password: z
    .string()
    .trim()
    .min(1, { message: "common.required" })
    .regex(
      passwordRegex,
      "Password must be alphanumeric and contain at-least 8 characters"
    )
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  receipt_print_name: z.string().max(255, "common.maxLength").nullable(),
  trust_id: z
    .array(z.string())
    .min(1, { message: "common.required" })
    .default([]),
  user_type: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type UserMasterFormFieldValues = z.infer<typeof UserMasterFromSchema>;

type UserMasterFormProps = {
  defaultValues?: UserMasterFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<UserMasterFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<UserMasterFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: UserMasterFormFieldValues = {
  address_type_id: [],
  allow_donation_day: false,
  allow_donation_login: false,
  allow_print_export: false,
  branch_id: [],
  closed_time: null,
  contact_no: null,
  donation_day: null,
  donation_edit: false,
  donation_edit_from_date: null,
  donation_edit_to_date: null,
  donation_view_from_date: null,
  email: null,
  enable_two_factor: false,
  event_id: [],
  financial_year_id: [],
  full_name: null,
  full_permission: false,
  is_active: false,
  login_name: null,
  password: null,
  receipt_print_name: null,
  trust_id: [],
  user_type: null,
};

export const UserMasterFrom = forwardRef(
  (
    { defaultValues = formDefaultValues, loading = false }: UserMasterFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
      watch,
    } = useForm({
      mode: "all",
      resolver: zodResolver(UserMasterFromSchema),
      values: defaultValues,
    });

    useEnableDisableButton({ control, defaultValues, errors });

    const donationEdit = watch("donation_edit");

    const allowDonationDay = watch("allow_donation_day");

    const donationEditFromDate = watch("donation_edit_from_date");

    const {
      address_type_id,
      branch_id,
      contact_no,
      email,
      event_id,
      financial_year_id,
      full_name,
      login_name,
      password,
      receipt_print_name,
      trust_id,
      user_type,
    } = errors;

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        // eslint-disable-next-line sonarjs/cognitive-complexity
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
            allow_donation_day:
              defaultValues.allow_donation_day &&
              !dirtyFields.allow_donation_day
                ? false
                : true,
            allow_donation_login:
              defaultValues.allow_donation_login &&
              !dirtyFields.allow_donation_login
                ? false
                : true,
            allow_print_export:
              defaultValues.allow_print_export &&
              !dirtyFields.allow_print_export
                ? false
                : true,
            donation_edit:
              defaultValues.donation_edit && !dirtyFields.donation_edit
                ? false
                : true,
            enable_two_factor:
              defaultValues.enable_two_factor && !dirtyFields.enable_two_factor
                ? false
                : true,
            full_permission:
              defaultValues.full_permission && !dirtyFields.full_permission
                ? false
                : true,
            is_active:
              defaultValues.is_active && !dirtyFields.is_active ? false : true,
            password:
              defaultValues.login_name && !dirtyFields.password
                ? false
                : dirtyFields.password,
          });

          onSubmit(filterFormValues);
        })();
      },
    }));

    return (
      <FormContainer>
        <FormGridLayout columns={3}>
          <TextField
            name="full_name"
            control={control}
            loading={loading}
            label="Full Name"
            required
            setError={setError}
            error={!!full_name}
            helperText={errorMessages(full_name?.message)}
          />

          <TextField
            name="login_name"
            control={control}
            loading={loading}
            label="Login Name"
            required
            setError={setError}
            error={!!login_name}
            helperText={errorMessages(login_name?.message)}
          />

          <PasswordField
            control={control}
            label="Password"
            name="password"
            placeholder="Password"
            required
            error={!!password}
            helperText={errorMessages(password?.message)}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <TextField
            name="email"
            control={control}
            required
            loading={loading}
            label="Email"
            letterCase="lowercase"
            error={!!email}
            helperText={errorMessages(email?.message)}
          />

          <PhoneInputField
            control={control}
            loading={loading}
            required
            label="Contact Number"
            name="contact_no"
            error={!!contact_no}
            helperText={errorMessages(contact_no?.message)}
          />

          <BranchAutocomplete
            loading={loading}
            name="branch_id"
            control={control}
            required
            multiple
            error={!!branch_id}
            helperText={errorMessages(branch_id?.message)}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <TextField
            name="receipt_print_name"
            control={control}
            loading={loading}
            label="Receipt Print Name"
            setError={setError}
            error={!!receipt_print_name}
            helperText={errorMessages(receipt_print_name?.message)}
          />

          <FinancialYearAutocomplete
            loading={loading}
            name="financial_year_id"
            multiple
            required
            control={control}
            error={!!financial_year_id}
            helperText={errorMessages(financial_year_id?.message)}
          />

          <UserTypeAutocomplete
            loading={loading}
            name="user_type"
            control={control}
            required
            error={!!user_type}
            helperText={errorMessages(user_type?.message)}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <TimePicker
            label="Closed Time"
            loading={loading}
            control={control}
            name="closed_time"
            isReturnLocalTime={true}
            ampm={true}
            format="hh:mm a"
          />

          <DatePicker
            name="donation_view_from_date"
            control={control}
            label="Donation View From"
            loading={loading}
            setError={setError}
          />

          <TrustAutocomplete
            loading={loading}
            name="trust_id"
            control={control}
            required
            multiple
            error={!!trust_id}
            helperText={errorMessages(trust_id?.message)}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <AddressTypeAutocomplete
            loading={loading}
            name="address_type_id"
            control={control}
            multiple
            required
            error={!!address_type_id}
            helperText={errorMessages(address_type_id?.message)}
          />

          <TextField
            label="Day"
            type="number"
            name="donation_day"
            control={control}
            disabled={!allowDonationDay}
            loading={loading}
          />

          <EventAutocomplete
            loading={loading}
            name="event_id"
            control={control}
            multiple
            required
            error={!!event_id}
            helperText={errorMessages(event_id?.message)}
          />
        </FormGridLayout>

        <FormGridLayout columns={5}>
          <RadioGroupField
            name="is_active"
            control={control}
            loading={loading}
            label="Is Active"
            options={[
              {
                disabled: false,
                label: "Yes",
                values: true,
              },
              {
                disabled: false,
                label: "No",
                values: false,
              },
            ]}
          />

          <RadioGroupField
            name="full_permission"
            control={control}
            loading={loading}
            label="Is Full Permission"
            options={[
              {
                disabled: false,
                label: "Yes",
                values: true,
              },
              {
                disabled: false,
                label: "No",
                values: false,
              },
            ]}
          />

          <RadioGroupField
            name="allow_print_export"
            control={control}
            loading={loading}
            label="Allow Print Export"
            options={[
              {
                disabled: false,
                label: "Yes",
                values: true,
              },
              {
                disabled: false,
                label: "No",
                values: false,
              },
            ]}
          />

          <RadioGroupField
            name="allow_donation_login"
            control={control}
            loading={loading}
            label="Allow Donation Login"
            options={[
              {
                disabled: false,
                label: "Yes",
                values: true,
              },
              {
                disabled: false,
                label: "No",
                values: false,
              },
            ]}
          />

          <RadioGroupField
            name="enable_two_factor"
            control={control}
            loading={loading}
            label="Allow Login OTP"
            options={[
              {
                disabled: false,
                label: "Yes",
                values: true,
              },
              {
                disabled: false,
                label: "No",
                values: false,
              },
            ]}
          />
        </FormGridLayout>

        <FormGridLayout columns={5}>
          <RadioGroupField
            name="allow_donation_day"
            control={control}
            loading={loading}
            label="Allow Donation Day"
            options={[
              {
                disabled: false,
                label: "Yes",
                values: true,
              },
              {
                disabled: false,
                label: "No",
                values: false,
              },
            ]}
          />

          <RadioGroupField
            name="donation_edit"
            control={control}
            loading={loading}
            label="Donation Edit"
            options={[
              {
                disabled: false,
                label: "Yes",
                values: true,
              },
              {
                disabled: false,
                label: "No",
                values: false,
              },
            ]}
          />

          {donationEdit && (
            <DatePicker
              control={control}
              label="Donation Edit Start Date"
              name="donation_edit_from_date"
              clearable={false}
            />
          )}

          {donationEdit && (
            <DatePicker
              control={control}
              label="Donation Edit To Date"
              name="donation_edit_to_date"
              minDate={
                donationEditFromDate
                  ? DateTime.fromISO(donationEditFromDate)
                  : DateTime.now()
              }
              clearable={false}
            />
          )}
        </FormGridLayout>
      </FormContainer>
    );
  }
);

UserMasterFrom.displayName = "UserMasterFrom";
