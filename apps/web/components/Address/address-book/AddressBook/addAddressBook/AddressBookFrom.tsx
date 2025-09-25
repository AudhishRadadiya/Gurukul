import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { Button, FormSection, useDialogActions } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { AddressBookFromFields } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFromFields";
import { BusinessDetailList } from "@web/components/Address/address-book/AddressBook/addAddressBook/businessDetail/businessDetailList/BusinessDetailList";
import { AddBusinessDetailDialog } from "@web/components/Address/address-book/AddressBook/addAddressBook/businessDetail/Dialog/AddBusinessDetailDialog";
import { BusinessDetailFormSchema } from "@web/components/Address/address-book/AddressBook/addAddressBook/businessDetail/Dialog/BusinessDetailForm";
import { AddFamilyMemberDetailDialog } from "@web/components/Address/address-book/AddressBook/addAddressBook/familyMemberDetail/Dialog/AddFamilyMemberDetailDialog";
import { FamilyMemberFormSchema } from "@web/components/Address/address-book/AddressBook/addAddressBook/familyMemberDetail/Dialog/FamilyMemberForm";
import { FamilyMemberDetailList } from "@web/components/Address/address-book/AddressBook/addAddressBook/familyMemberDetail/familyMemberDetailList/FamilyMemberDetailList";
import { GeneralDetailsFromFields } from "@web/components/Address/address-book/AddressBook/addAddressBook/GeneralDetailsFromFields";
import { usePostUserData } from "@web/components/Address/address-book/AddressBook/addAddressBook/hooks/usePostUserData";
import { PastStudentFromFields } from "@web/components/Address/address-book/AddressBook/addAddressBook/PastStudentFromFields";
import { BloodGroupSchema } from "@web/components/common/Autocomplete/hooks/useGetBloodGroupOptions";
import { GenderSchema } from "@web/components/common/Autocomplete/hooks/useGetGenderOptions";
import {
  filterNestedChangedFormFields,
  removeNegationValues,
} from "@web/utils/helper";
import {
  aadharCardRegex,
  emailRegex,
  licenseNumberRegex,
  mobileNumberRegex,
  panCardRegex,
  pinCodeRegex,
  voterIdRegex,
} from "@web/utils/regex";

export const AddressBookFromSchema = z.object({
  aadhar_no: z
    .string()
    .regex(aadharCardRegex, "common.aadhar_no.invalid")
    .optional()
    .nullable(),
  address: z.string().nullable(),
  address_type_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  alternet_mobile_no: z
    .string()
    .regex(mobileNumberRegex, "common.mobileNumber.invalid")
    .nullable(),
  anniversary_date: z.string().nullable(),
  b_note: z.string().nullable(),
  birth_date: z.string().nullable(),
  blood_group: BloodGroupSchema.nullable(),
  business_detail: z.array(BusinessDetailFormSchema).nullable().optional(),
  business_parameter_id: z.string().nullable(),
  category_1_parameters_id: z.string().nullable(),
  category_2_parameters_id: z.string().nullable(),
  city: z.string().nullable(),
  class_mate: z.string().nullable(),
  contact_no: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  district: z.string().nullable(),
  driving_licence_no: z
    .string()
    .regex(licenseNumberRegex, "common.license_no.invalid")
    .optional()
    .nullable(),
  education_parameter_id: z.string().nullable(),
  elector_number: z
    .string()
    .regex(voterIdRegex, "common.voter.id.invalid")
    .optional()
    .nullable(),
  email_id: z
    .string()
    .regex(emailRegex, "common.email.invalid")
    .optional()
    .nullable(),
  family_detail: z.array(FamilyMemberFormSchema).nullable().optional(),
  first_name: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  g_no: z
    .number()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  gender: GenderSchema.nullable().optional(),
  gurukul_parameters_id: z.string().nullable(),
  hastak_1_parameter_id: z.string().nullable(),
  hastak_2_parameter_id: z.string().nullable(),
  is_past_student: z.boolean().optional(),
  is_vip: z.boolean().optional(),
  landmark: z.string().nullable(),
  leave_in: z.number().nullable(),
  medium: z.number().nullable(),
  middle_name: z.string().nullable(),
  note: z.string().nullable(),
  pan_no: z
    .string()
    .regex(panCardRegex, "common.pan_card_no.invalid")
    .optional()
    .nullable(),
  parent_contact_no: z.string().nullable(),
  passport_no: z.string().nullable(),
  patrika: z.boolean().optional(),
  pincode: z
    .string()
    .regex(pinCodeRegex, "common.pin_code.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  saints_hastak_parameter_id: z.string().nullable(),
  ssc_gurukul: z.string().nullable(),
  ssc_year: z.number().nullable(),
  surname: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  taluko: z.string().nullable(),
  village: z.string().nullable(),
  zone_parameter_id: z.string().nullable(),
});

export type AddressBookFormFieldValues = z.infer<typeof AddressBookFromSchema>;

type AddressBookFormProps = {
  defaultValues?: AddressBookFormFieldValues;
  loading: boolean;
};

export type FormRef = {
  setError: UseFormSetError<AddressBookFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<AddressBookFormFieldValues>) => void
  ) => void;
};

export const formDefaultValues: AddressBookFormFieldValues = {
  aadhar_no: null,
  address: null,
  address_type_id: null,
  alternet_mobile_no: null,
  anniversary_date: null,
  b_note: null,
  birth_date: null,
  blood_group: null,
  business_detail: [],
  business_parameter_id: null,
  category_1_parameters_id: null,
  category_2_parameters_id: null,
  city: null,
  class_mate: null,
  contact_no: null,
  district: null,
  driving_licence_no: null,
  education_parameter_id: null,
  elector_number: null,
  email_id: null,
  family_detail: [],
  first_name: null,
  g_no: null,
  gender: null,
  gurukul_parameters_id: null,
  hastak_1_parameter_id: null,
  hastak_2_parameter_id: null,
  is_past_student: false,
  is_vip: false,
  landmark: null,
  leave_in: null,
  medium: null,
  middle_name: null,
  note: null,
  pan_no: null,
  parent_contact_no: null,
  passport_no: null,
  patrika: false,
  pincode: null,
  saints_hastak_parameter_id: null,
  ssc_gurukul: null,
  ssc_year: null,
  surname: null,
  taluko: null,
  village: null,
  zone_parameter_id: null,
};

export const AddressBookFrom = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: AddressBookFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

    const methods = useForm<AddressBookFormFieldValues>({
      mode: "all",
      resolver: zodResolver(AddressBookFromSchema),
      values: defaultValues,
    });

    const {
      formState: { dirtyFields },
      handleSubmit,
      reset,
      setError,
      setValue,
      watch,
    } = methods;

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterNestedChangedFormFields(
            formValues,
            dirtyFields
          );

          onSubmit(
            dirtyFields.contact_no
              ? removeNegationValues(filterFormValues)
              : filterFormValues
          );
        })();
      },
    }));

    const familyDetailList = watch("family_detail") || [];

    const businessDetailList = watch("business_detail") || [];

    const contactNo = watch("contact_no") ?? "";

    const dialogRenderer: DialogRenderer = {
      addBusinessDetail: (
        <AddBusinessDetailDialog
          open
          onClose={onDialogClose}
          onAdd={(formValues) => {
            setValue("business_detail", [...businessDetailList, formValues], {
              shouldDirty: true,
            });

            onDialogClose();
          }}
        />
      ),
      addFamilyMember: (
        <AddFamilyMemberDetailDialog
          open
          onClose={onDialogClose}
          onAdd={(formValues) => {
            setValue("family_detail", [...familyDetailList, formValues], {
              shouldDirty: true,
            });

            onDialogClose();
          }}
        />
      ),
    };

    const setUserData = (userData: AddressBookFormFieldValues) => {
      reset(userData, { keepDefaultValues: true, keepDirty: true });
    };

    usePostUserData({
      contactNo,
      onSuccess: setUserData,
    });

    useMemo(() => {
      setUserData({ ...formDefaultValues, contact_no: contactNo });
    }, [contactNo]);

    return (
      <FormProvider {...methods}>
        <AddressBookFromFields loading={loading} />

        <GeneralDetailsFromFields loading={loading} />

        <PastStudentFromFields loading={loading} />

        <Stack direction="row" justifyContent="space-between">
          <FormSection title={t("common.family.member")}></FormSection>

          <Button
            variant="outlined"
            sx={{ height: "50%" }}
            disabled={loading}
            startIcon={<Add />}
            onClick={() => {
              onDialogOpen("addFamilyMember");
            }}
          >
            {t("common.button.add", {
              label: t(t("common.family.member")),
            })}
          </Button>
        </Stack>

        {!_isEmpty(familyDetailList) && (
          <FamilyMemberDetailList
            familyMemberFormValues={familyDetailList}
            setValue={setValue}
          />
        )}

        <Stack direction="row" justifyContent="space-between">
          <FormSection title={t("address.businessDetail.label")}></FormSection>

          <Button
            variant="outlined"
            sx={{ height: "50%" }}
            disabled={loading}
            startIcon={<Add />}
            onClick={() => {
              onDialogOpen("addBusinessDetail");
            }}
          >
            {t("common.button.add", {
              label: t(t("address.businessDetail.label")),
            })}
          </Button>
        </Stack>

        {!_isEmpty(businessDetailList) && (
          <BusinessDetailList
            businessDetailFormValues={businessDetailList}
            setValue={setValue}
          />
        )}

        {openedDialog && dialogRenderer[openedDialog]}
      </FormProvider>
    );
  }
);

AddressBookFrom.displayName = "AddressBookFrom";
