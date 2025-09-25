import {
  FormContainer,
  FormGridLayout,
  PhoneInputField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ImageUploadField } from "@web/components/common/ImageUploadField";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";
import { isValidMobileNumber } from "@web/utils/mobileNumberValidate";
import { gstNoRegex } from "@web/utils/regex";

const BranchMasterFormSchema = z.object({
  address: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  branch_code: z
    .string()
    .max(20, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  branch_name: z
    .string()
    .max(50, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  city: z
    .string()
    .max(10, "common.maxLength")
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
  contact_person_name: z
    .string()
    .max(20, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  gst_no: z.string().regex(gstNoRegex, "common.gst_no.invalid").nullable(),
  logo: z.string().nullable(),
});

export type BranchMasterFormFieldValues = z.infer<
  typeof BranchMasterFormSchema
>;

type BranchMasterFormProps = {
  defaultValues?: BranchMasterFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<BranchMasterFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<BranchMasterFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: BranchMasterFormFieldValues = {
  address: null,
  branch_code: null,
  branch_name: null,
  city: null,
  contact_no: null,
  contact_person_name: null,
  gst_no: null,
  logo: null,
};

export const BranchMasterForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: BranchMasterFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
    } = useForm({
      mode: "all",
      resolver: zodResolver(BranchMasterFormSchema),
      values: defaultValues,
    });

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

    return (
      <FormContainer>
        <FormGridLayout columns={3}>
          <ImageUploadField
            control={control}
            name="logo"
            loading={loading}
            label=""
          />

          <TextField
            control={control}
            label="Branch Name"
            name="branch_name"
            loading={loading}
            required
            error={!!errors.branch_name}
            helperText={errorMessages(errors.branch_name?.message)}
          />

          <TextField
            name="branch_code"
            control={control}
            loading={loading}
            label="Branch Code"
            required
            error={!!errors.branch_code}
            helperText={errorMessages(errors.branch_code?.message)}
          />

          <TextField
            name="gst_no"
            loading={loading}
            control={control}
            required
            isCapitalize
            label="GST No"
            error={!!errors.gst_no}
            helperText={errorMessages(errors.gst_no?.message)}
            maxLength={15}
          />

          <PhoneInputField
            control={control}
            label="Contact No"
            name="contact_no"
            loading={loading}
            required
            error={!!errors.contact_no}
            helperText={errorMessages(errors.contact_no?.message)}
          />

          <TextField
            control={control}
            label="Contact Person Name"
            name="contact_person_name"
            loading={loading}
            required
            error={!!errors.contact_person_name}
            helperText={errorMessages(errors.contact_person_name?.message)}
          />

          <TextField
            control={control}
            label="City"
            name="city"
            loading={loading}
            required
            error={!!errors.city}
            helperText={errorMessages(errors.city?.message)}
          />

          <TextField
            name="address"
            control={control}
            loading={loading}
            label="Address"
            required
            multiline
            rows={4}
            error={!!errors.address}
            helperText={errorMessages(errors.address?.message)}
            placeholder="Enter Address"
          />
        </FormGridLayout>
      </FormContainer>
    );
  }
);

BranchMasterForm.displayName = "BranchMasterForm";
