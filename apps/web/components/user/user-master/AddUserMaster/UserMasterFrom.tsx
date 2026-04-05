import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ColumnArrangerDialog,
  ColumnIconAction,
  DatePicker,
  FormContainer,
  FormGridLayout,
  GridProvider,
  PadBox,
  PasswordField,
  PhoneInputField,
  RadioGroupField,
  TextField,
  TimePicker,
  toasts,
  useDialogActions,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useGetAddressBookColumns } from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/useGetAddressBookColumns";
import { useGetAddressBookColumnsDefault } from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/useGetAddressBookColumnsDefault";
import type { AddressBookColumnHideTypes } from "@web/components/Address/address-book/template/dialogs/hooks/templateTypes";
import { AddressTypeAutocomplete } from "@web/components/common/Autocomplete/AddressTypeAutocomplete";
import { BranchAutocomplete } from "@web/components/common/Autocomplete/BranchAutocomplete";
import { EventAutocomplete } from "@web/components/common/Autocomplete/EventAutocomplete";
import { FinancialYearAutocomplete } from "@web/components/common/Autocomplete/FinancialYearAutocomplete";
import { PermittedUserAutocomplete } from "@web/components/common/Autocomplete/PermittedUserAutocomplete";
import { TrustAutocomplete } from "@web/components/common/Autocomplete/TrustAutocomplete";
import { UserTypeAutocomplete } from "@web/components/common/Autocomplete/UserTypeAutocomplete";
import { useCheckVeo } from "@web/components/user/user-master/AddUserMaster/hooks/useCheckVeo";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import {
  errorMessages,
  filterChangedFormFields,
  resetDependentFields,
} from "@web/utils/helper";
import { isValidMobileNumber } from "@web/utils/mobileNumberValidate";
import { emailRegex } from "@web/utils/regex";

const UserMasterFromSchema = z
  .object({
    address_list_fields: z.record(z.boolean()).optional().nullable().optional(),
    address_type_id: z
      .array(z.string())
      .min(1, { message: "common.required" })
      .default([]),
    allow_donation_day: z.boolean().optional(),
    allow_login_otp: z.boolean().optional(),
    allow_print_export: z.boolean().optional(),
    allow_two_auth: z.boolean().optional(),
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
    donation_edit_day: z.number().nullable(),
    donation_edit_from_date: z.string().nullable().optional(),
    donation_edit_to_date: z.string().nullable().optional(),
    donation_edit_type: z.boolean().optional(),
    donation_view_from_date: z.string().nullable(),
    email: z
      .string()
      .trim()
      .regex(emailRegex, "common.email.invalid")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    event_id: z.array(z.string()).default([]),
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
    is_veo: z.boolean().optional(),
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
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    receipt_print_name: z.string().max(255, "common.maxLength").nullable(),
    trust_id: z
      .array(z.string())
      .min(1, { message: "common.required" })
      .default([]),
    user_permission_id: z.string().nullable().optional(),
    user_type: z
      .string()
      .max(255, "common.maxLength")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    veo_contact_no: z
      .string()
      .refine(isValidMobileNumber, {
        message: "common.mobileNumber.invalid",
      })
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.is_veo && !data.veo_contact_no) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["veo_contact_no"],
      });
    }
  });

export type UserMasterFormFieldValues = z.infer<typeof UserMasterFromSchema>;

type UserMasterFormProps = {
  defaultValues?: UserMasterFormFieldValues;
  loading?: boolean;
  userId?: string;
};

export type FormRef = {
  setError: UseFormSetError<UserMasterFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<UserMasterFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: UserMasterFormFieldValues = {
  address_list_fields: null,
  address_type_id: [],
  allow_donation_day: false,
  allow_login_otp: false,
  allow_print_export: false,
  allow_two_auth: false,
  branch_id: [],
  closed_time: null,
  contact_no: null,
  donation_day: null,
  donation_edit: false,
  donation_edit_day: null,
  donation_edit_from_date: null,
  donation_edit_to_date: null,
  donation_view_from_date: null,
  email: null,
  event_id: [],
  financial_year_id: [],
  full_name: null,
  full_permission: false,
  is_active: false,
  is_veo: false,
  login_name: null,
  password: null,
  receipt_print_name: null,
  trust_id: [],
  user_permission_id: null,
  user_type: null,
  veo_contact_no: null,
};

export const UserMasterFrom = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      userId,
    }: UserMasterFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      clearErrors,
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
      setValue,
      watch,
    } = useForm({
      mode: "all",
      resolver: zodResolver(UserMasterFromSchema),
      values: defaultValues,
    });

    useEnableDisableButton({ control, defaultValues, errors });

    const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

    const [columnHide, setColumnHide] = useState<Record<string, boolean>>({});

    const { data: defaultColumns } = useGetAddressBookColumnsDefault();

    useMemo(() => {
      if (defaultColumns && defaultValues.address_list_fields) {
        setColumnHide(defaultValues.address_list_fields);
      } else if (defaultColumns && !defaultValues.address_list_fields) {
        setColumnHide(defaultColumns);
      }
    }, [defaultColumns, defaultValues.address_list_fields]);

    const { columns } = useGetAddressBookColumns({
      columnHide: (!_isEmpty(columnHide)
        ? columnHide
        : defaultColumns) as AddressBookColumnHideTypes,
    });

    // Filter columns to only show those that exist in defaultColumns
    const filteredColumns = useMemo(() => {
      const sourceColumns = !_isEmpty(columnHide) ? columnHide : defaultColumns;

      if (!sourceColumns) {
        return columns;
      }

      return columns.filter((col) => col.field && col.field in sourceColumns);
    }, [columns, defaultColumns, columnHide]);

    const handleColumnSave = (columns: Record<string, boolean>) => {
      setColumnHide(columns);
    };

    const dialogRenderer: DialogRenderer = {
      columnChooser: (
        <ColumnArrangerDialog<Record<string, boolean>>
          columns={filteredColumns}
          title={t("common.column.chooser")}
          open
          onClose={onDialogClose}
          onSave={handleColumnSave}
        />
      ),
    };

    const donationEdit = watch("donation_edit");

    const isVeoEnabled = watch("is_veo");

    const {
      error: veoError,
      isError: isVeoError,
      isSuccess: isVeoSuccess,
    } = useCheckVeo({
      enabled: isVeoEnabled,
      userId,
    });

    const donationEditType = watch("donation_edit_type");

    const allowDonationDay = watch("allow_donation_day");

    const donationEditFromDate = watch("donation_edit_from_date");

    useMemo(() => {
      if (isVeoEnabled && isVeoError && veoError) {
        const errorMessage =
          // @ts-expect-error - Error response structure may vary
          veoError?.response?.data?.message ||
          "Demo key not available. Please try again.";

        toasts.error({
          title: errorMessage,
        });

        setValue("is_veo", false);
      }
    }, [isVeoError, veoError]);

    const {
      address_type_id,
      branch_id,
      contact_no,
      email,
      financial_year_id,
      full_name,
      login_name,
      password,
      receipt_print_name,
      trust_id,
      user_type,
      veo_contact_no,
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

            allow_login_otp:
              defaultValues.allow_login_otp && !dirtyFields.allow_login_otp
                ? false
                : true,
            allow_print_export:
              defaultValues.allow_print_export &&
              !dirtyFields.allow_print_export
                ? false
                : true,
            allow_two_auth:
              defaultValues.allow_two_auth && !dirtyFields.allow_two_auth
                ? false
                : true,
            donation_edit:
              defaultValues.donation_edit && !dirtyFields.donation_edit
                ? false
                : true,
            donation_edit_type: false,
            full_permission:
              defaultValues.full_permission && !dirtyFields.full_permission
                ? false
                : true,
            is_active:
              defaultValues.is_active && !dirtyFields.is_active ? false : true,
            is_veo: defaultValues.is_veo && !dirtyFields.is_veo ? false : true,
            password:
              defaultValues.login_name && !dirtyFields.password
                ? false
                : dirtyFields.password,
          });

          onSubmit({ ...filterFormValues, address_list_fields: columnHide });
        })();
      },
    }));

    const dependentFieldsMap: Partial<
      Record<
        keyof UserMasterFormFieldValues,
        (keyof UserMasterFormFieldValues)[]
      >
    > = {
      is_veo: ["veo_contact_no"],
    };

    useMemo(() => {
      resetDependentFields({
        clearErrors,
        dependentFieldsMap,
        dirtyFields,
        fieldName: "is_veo",
        fieldValue: isVeoEnabled,
        setValue,
      });
    }, [isVeoEnabled]);

    return (
      <>
        <FormContainer>
          <GridProvider gap="15px" columns={4}>
            <TextField
              name="full_name"
              control={control}
              letterCase="mixed"
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
              letterCase="mixed"
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
              letterCase="mixed"
              placeholder="Password"
              required
              error={!!password}
              helperText={errorMessages(password?.message)}
            />

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

            <UserTypeAutocomplete
              loading={loading}
              name="user_type"
              disabled={defaultValues.user_type == "admin"}
              control={control}
              required
              error={!!user_type}
              helperText={errorMessages(user_type?.message)}
            />

            <PermittedUserAutocomplete
              loading={loading}
              label="Copy User Permission"
              name="user_permission_id"
              control={control}
            />

            <TextField
              name="receipt_print_name"
              control={control}
              characterType="string"
              letterCase="mixed"
              loading={loading}
              label="Receipt Print Name"
              setError={setError}
              error={!!receipt_print_name}
              helperText={errorMessages(receipt_print_name?.message)}
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

            <FinancialYearAutocomplete
              loading={loading}
              name="financial_year_id"
              multiple
              required
              control={control}
              error={!!financial_year_id}
              helperText={errorMessages(financial_year_id?.message)}
            />

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
            />
          </GridProvider>

          <FormGridLayout columns={isVeoEnabled ? 6 : 5}>
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
              name="allow_login_otp"
              control={control}
              loading={loading}
              label="Allow Mobile OTP"
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
              name="is_veo"
              control={control}
              loading={loading}
              label="Is Demo"
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

            {isVeoSuccess && (
              <PadBox
                padding={{
                  padding: "15px",
                }}
              >
                <PasswordField
                  control={control}
                  loading={loading}
                  characterType="string-number"
                  required
                  label="Demo Contact Number"
                  name="veo_contact_no"
                  error={!!veo_contact_no}
                  helperText={errorMessages(veo_contact_no?.message)}
                />
              </PadBox>
            )}
          </FormGridLayout>

          <FormGridLayout columns={5}>
            <RadioGroupField
              name="allow_two_auth"
              control={control}
              loading={loading}
              label="Allow Google Authenticator"
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
              <RadioGroupField
                name="donation_edit_type"
                control={control}
                loading={loading}
                label="Donation Edit Type"
                options={[
                  {
                    disabled: false,
                    label: "Day Wis Edit",
                    values: true,
                  },
                  {
                    disabled: false,
                    label: "Date Wis Edit",
                    values: false,
                  },
                ]}
              />
            )}
          </FormGridLayout>

          <FormGridLayout columns={5}>
            {donationEdit && donationEditType === true && (
              <TextField
                label="Donation Edit Day"
                type="number"
                name="donation_edit_day"
                control={control}
                disabled={!allowDonationDay}
                loading={loading}
              />
            )}

            {donationEdit && donationEditType === false && (
              <Stack gap="10px" direction="row">
                <DatePicker
                  control={control}
                  label="Donation Edit Start Date"
                  name="donation_edit_from_date"
                  clearable={false}
                />

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
              </Stack>
            )}
          </FormGridLayout>

          <FormGridLayout columns={5}>
            <Stack gap="10px" direction="row" alignItems="center">
              <Typography variant="body1">
                {t("addressListColumns.label")}
              </Typography>
              <ColumnIconAction
                onClick={() => {
                  onDialogOpen("columnChooser");
                }}
              />
            </Stack>
          </FormGridLayout>
        </FormContainer>

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

UserMasterFrom.displayName = "UserMasterFrom";
