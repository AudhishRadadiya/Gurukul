import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError, UseFormSetValue } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { z } from "zod";

import { AddressBookFromFields } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFromFields";
import { BusinessDetailList } from "@web/components/Address/address-book/AddressBook/addAddressBook/businessDetail/businessDetailList/BusinessDetailList";
import { AddBusinessDetailDialog } from "@web/components/Address/address-book/AddressBook/addAddressBook/businessDetail/Dialog/AddBusinessDetailDialog";
import { BusinessDetailFormSchema } from "@web/components/Address/address-book/AddressBook/addAddressBook/businessDetail/Dialog/BusinessDetailForm";
import { AddFamilyMemberDetailDialog } from "@web/components/Address/address-book/AddressBook/addAddressBook/familyMemberDetail/Dialog/AddFamilyMemberDetailDialog";
import { FamilyMemberFormSchema } from "@web/components/Address/address-book/AddressBook/addAddressBook/familyMemberDetail/Dialog/FamilyMemberForm";
import { FamilyMemberDetailList } from "@web/components/Address/address-book/AddressBook/addAddressBook/familyMemberDetail/familyMemberDetailList/FamilyMemberDetailList";
import { GeneralDetailsFromFields } from "@web/components/Address/address-book/AddressBook/addAddressBook/GeneralDetailsFromFields";
import { useGetAutoGno } from "@web/components/Address/address-book/AddressBook/addAddressBook/hooks/useGetAutoGno";
import { usePostUserData } from "@web/components/Address/address-book/AddressBook/addAddressBook/hooks/usePostUserData";
import { PastStudentFromFields } from "@web/components/Address/address-book/AddressBook/addAddressBook/PastStudentFromFields";
import { BloodGroupSchema } from "@web/components/common/Autocomplete/hooks/useGetBloodGroupOptions";
import { GenderSchema } from "@web/components/common/Autocomplete/hooks/useGetGenderOptions";
import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { useBranch } from "@web/context/BranchContext";
import {
  filterNestedChangedFormFields,
  removeNegationValues,
} from "@web/utils/helper";
import {
  emailRegex,
  mobileNoRegex,
  panCardRegex,
  pinCodeRegex,
} from "@web/utils/regex";

const PastStudentDetailsSchema = z.object({
  address_type_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  category_1_parameters_id: z.string().nullable(),
  category_2_parameters_id: z.string().nullable(),
  class_mate: z.string().nullable(),
  gurukul_parameters_id: z.string().nullable(),
  is_past_student: z.boolean(),
  is_vip: z.boolean(),
  leave_in: z.number().nullable(),
  medium: z.number().nullable(),
  patrika: z.boolean(),
  ssc_gurukul: z.string().nullable(),
  ssc_year: z.number().nullable(),
});

export const AddressBookFromSchema = z.object({
  // aadhar_no: z
  //   .string()
  //   .regex(aadharCardRegex, "common.aadhar_no.invalid")
  //   .optional()
  //   .nullable(),
  address: z.string().nullable(),
  alternet_mobile_no: z
    .string()
    .regex(mobileNoRegex, "common.mobileNumber.invalid")
    .nullable(),
  anniversary_date: z.string().nullable(),
  b_note: z.string().nullable(),
  birth_date: z.string().nullable(),
  blood_group: BloodGroupSchema.nullable(),
  branch_id: z.string().nullable().optional(),
  business_detail: z.array(BusinessDetailFormSchema).nullable().optional(),
  business_parameter_id: z.string().nullable(),
  city: z.string().nullable(),
  contact_no: z
    .string()
    .regex(mobileNoRegex, "common.mobileNumber.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  district: z.string().nullable(),
  // driving_licence_no: z
  //   .string()
  //   .regex(licenseNumberRegex, "common.license_no.invalid")
  //   .optional()
  //   .nullable(),
  education_parameter_id: z.string().nullable(),
  // elector_number: z
  //   .string()
  //   .regex(voterIdRegex, "common.voter.id.invalid")
  //   .optional()
  //   .nullable(),
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
  hastak_1_parameter_id: z.string().nullable(),
  hastak_2_parameter_id: z.string().nullable(),
  // landmark: z.string().nullable(),
  logo: z.string().nullable(),
  middle_name: z.string().nullable(),
  note: z.string().nullable(),
  pan_no: z
    .string()
    .regex(panCardRegex, "common.pan_card_no.invalid")
    .optional()
    .nullable(),
  parent_contact_no: z.string().nullable(),
  // passport_no: z.string().nullable(),
  past_student_details: z.array(PastStudentDetailsSchema).nullable().optional(),
  pincode: z
    .string()
    .regex(pinCodeRegex, "common.pin_code.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  saints_hastak_parameter_id: z.string().nullable(),
  state: z.string().nullable().optional(),
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

export const pastStudentDetailsDefaultValues = {
  address_type_id: null,
  category_1_parameters_id: null,
  category_2_parameters_id: null,
  class_mate: null,
  gurukul_parameters_id: null,
  is_past_student: false,
  is_vip: false,
  leave_in: 1,
  medium: 1,
  patrika: false,
  ssc_gurukul: null,
  ssc_year: null,
};

type AddressBookFormProps = {
  defaultValues?: AddressBookFormFieldValues;
  loading: boolean;
};

export type FormRef = {
  setError: UseFormSetError<AddressBookFormFieldValues>;
  setValue: UseFormSetValue<AddressBookFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<AddressBookFormFieldValues>) => void
  ) => void;
};

export const formDefaultValues: AddressBookFormFieldValues = {
  address: null,
  alternet_mobile_no: null,
  anniversary_date: null,
  b_note: null,
  birth_date: null,
  blood_group: null,
  branch_id: null,
  business_detail: [],
  business_parameter_id: null,
  city: null,
  contact_no: null,
  district: null,
  education_parameter_id: null,
  email_id: null,
  family_detail: [],
  first_name: null,
  g_no: null,
  gender: null,
  hastak_1_parameter_id: null,
  hastak_2_parameter_id: null,
  // landmark: null,
  logo: null,
  middle_name: null,
  note: null,
  pan_no: null,
  parent_contact_no: null,
  past_student_details: [pastStudentDetailsDefaultValues],
  pincode: null,
  saints_hastak_parameter_id: null,
  state: null,
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
      formState: { dirtyFields, errors },
      handleSubmit,
      reset,
      setError,
      setValue,
      watch,
    } = methods;

    const { branchIds } = useBranch();

    const { data: autoGno } = useGetAutoGno();

    useMemo(() => {
      if (autoGno?.g_no && !defaultValues.g_no) {
        setValue("g_no", autoGno.g_no, {
          shouldDirty: true,
        });
      }
    }, [autoGno]);

    useImperativeHandle(ref, () => ({
      setError,
      setValue,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterNestedChangedFormFields(formValues, {
            ...dirtyFields,
            business_detail: true,
            past_student_details: true,
          });

          const payload = {
            ...filterFormValues,
            branch_id: branchIds,
          };

          onSubmit(
            dirtyFields.contact_no ? removeNegationValues(payload) : payload
          );
        })();
      },
    }));

    const familyDetailList = watch("family_detail") || [];

    const businessDetailList = watch("business_detail") || [];

    const [contactNoInput] = useDebounceValue(watch("contact_no"), 4000);

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
      contactNo: !errors.contact_no && contactNoInput ? contactNoInput : "",
      onSuccess: setUserData,
    });

    return (
      <FormProvider {...methods}>
        <AddressBookFromFields loading={loading} />

        <GeneralDetailsFromFields loading={loading} />

        <PastStudentFromFields loading={loading} />

        <Stack gap={2} sx={{ mt: { md: 2, xs: 2.5 } }}>
          <Stack
            direction="row"
            gap={1}
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Typography fontWeight={700} variant="h5" sx={{ flexShrink: 0 }}>
              {t("common.family.member")}
            </Typography>

            <ButtonLayoutProvider
              disabled={loading}
              onClick={() => {
                onDialogOpen("addFamilyMember");
              }}
              label={t("common.button.add", {
                label: t(t("common.family.member")),
              })}
              sx={{
                flexShrink: 0,
                whiteSpace: "nowrap",
                width: "auto",
              }}
            />
          </Stack>

          {!_isEmpty(familyDetailList) && (
            <Box sx={{ overflow: "hidden", width: "100%" }}>
              <FamilyMemberDetailList
                familyMemberFormValues={familyDetailList}
                setValue={setValue}
              />
            </Box>
          )}
        </Stack>

        <Stack gap={2} sx={{ mb: { md: 0, xs: 2.5 }, mt: { md: 2, xs: 2.5 } }}>
          <Stack
            direction="row"
            gap={1}
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Typography fontWeight={700} variant="h5" sx={{ flexShrink: 0 }}>
              {t("address.businessDetail.label")}
            </Typography>

            <ButtonLayoutProvider
              disabled={loading}
              onClick={() => {
                onDialogOpen("addBusinessDetail");
              }}
              label={t("common.button.add", {
                label: t(t("address.businessDetail.label")),
              })}
              sx={{
                flexShrink: 0,
                whiteSpace: "nowrap",
                width: "auto",
              }}
            />
          </Stack>

          {!_isEmpty(businessDetailList) && (
            <Box sx={{ overflow: "hidden", width: "100%" }}>
              <BusinessDetailList
                businessDetailFormValues={businessDetailList}
                setValue={setValue}
              />
            </Box>
          )}
        </Stack>

        {openedDialog && dialogRenderer[openedDialog]}
      </FormProvider>
    );
  }
);

AddressBookFrom.displayName = "AddressBookFrom";
