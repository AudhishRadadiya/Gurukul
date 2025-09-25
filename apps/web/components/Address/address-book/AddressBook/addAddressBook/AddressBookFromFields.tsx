import {
  DatePicker,
  FormContainer,
  FormGridLayout,
  FormSection,
  PhoneInputField,
  TextField,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useFormContext } from "react-hook-form";

import type { AddressBookFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";
import { CommonAddressBookAutocomplete } from "@web/components/Address/address-book/AddressBook/addAddressBook/CommonAddressBookAutocomplete";
import { BloodGroupAutocomplete } from "@web/components/common/Autocomplete/BloodGroupAutocomplete";
import { GenderAutocomplete } from "@web/components/common/Autocomplete/GenderAutocomplete";
import {
  CITY,
  CONTACT_NO,
  DISTRICT,
  FIRST_NAME,
  LANDMARK,
  MIDDLE_NAME,
  PINCODE,
  SURNAME,
  TALUKO,
  VILLAGE,
} from "@web/components/common/hooks/constant";
import { errorMessages } from "@web/utils/helper";

type AddressBookFromFieldsProps = {
  loading?: boolean;
};

export const AddressBookFromFields = ({
  loading = false,
}: AddressBookFromFieldsProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AddressBookFormFieldValues>();

  const getError = (name: keyof AddressBookFormFieldValues) => ({
    error: !!errors[name],
    helperText: errorMessages(errors[name]?.message),
  });

  return (
    <FormSection title={t("address.book.menu.label")}>
      <FormContainer>
        <FormGridLayout columns={3}>
          <CommonAddressBookAutocomplete
            label={t("common.contact.label")}
            name="contact_no"
            loading={loading}
            freeSolo
            required
            control={control}
            optionsKey={CONTACT_NO}
            {...getError("contact_no")}
          />

          <TextField
            type="number"
            name="g_no"
            required
            loading={loading}
            control={control}
            label={t("common.g.no")}
            {...getError("g_no")}
          />

          <CommonAddressBookAutocomplete
            label={t("common.parent.label")}
            name="parent_contact_no"
            loading={loading}
            freeSolo
            control={control}
            optionsKey={CONTACT_NO}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <CommonAddressBookAutocomplete
            loading={loading}
            label={t("common.first.name")}
            freeSolo
            name="first_name"
            required
            control={control}
            optionsKey={FIRST_NAME}
            {...getError("first_name")}
          />

          <CommonAddressBookAutocomplete
            loading={loading}
            label={t("common.middle.name")}
            name="middle_name"
            freeSolo
            control={control}
            optionsKey={MIDDLE_NAME}
          />

          <CommonAddressBookAutocomplete
            loading={loading}
            label={t("common.surname")}
            name="surname"
            freeSolo
            required
            control={control}
            optionsKey={SURNAME}
            {...getError("surname")}
          />
        </FormGridLayout>

        <FormGridLayout columns={4}>
          <TextField
            name="email_id"
            loading={loading}
            control={control}
            label={t("email.label")}
            {...getError("email_id")}
          />

          <PhoneInputField
            control={control}
            loading={loading}
            label={t("common.alternet.no")}
            name="alternet_mobile_no"
            {...getError("alternet_mobile_no")}
          />

          <TextField
            name="pan_no"
            loading={loading}
            control={control}
            isCapitalize
            label={t("common.pan.no")}
            {...getError("pan_no")}
          />

          <TextField
            name="driving_licence_no"
            loading={loading}
            control={control}
            isCapitalize
            label={t("license.no.label")}
            {...getError("driving_licence_no")}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <TextField
            name="aadhar_no"
            loading={loading}
            control={control}
            label={t("aadhar.no.label")}
            {...getError("aadhar_no")}
          />

          <TextField
            name="elector_number"
            loading={loading}
            control={control}
            isCapitalize
            label={t("common.elector.no")}
            {...getError("elector_number")}
          />

          <TextField
            name="passport_no"
            loading={loading}
            control={control}
            isCapitalize
            label={t("common.passport.no")}
            {...getError("passport_no")}
          />
        </FormGridLayout>

        <FormGridLayout columns={4}>
          <DatePicker
            control={control}
            label={t("common.birth.date")}
            name="birth_date"
            loading={loading}
            required
            clearable={false}
          />

          <DatePicker
            control={control}
            label={t("common.anniversary.date")}
            name="anniversary_date"
            required
            loading={loading}
            clearable={false}
          />

          <BloodGroupAutocomplete
            control={control}
            label={t("common.blood.group")}
            name="blood_group"
            loading={loading}
          />

          <GenderAutocomplete
            control={control}
            label={t("common.gender")}
            name="gender"
            loading={loading}
            {...getError("gender")}
          />
        </FormGridLayout>

        <FormGridLayout columns={1}>
          <TextField
            name="address"
            control={control}
            loading={loading}
            label={t("address.label")}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <CommonAddressBookAutocomplete
            label={t("common.city")}
            name="city"
            loading={loading}
            control={control}
            optionsKey={CITY}
          />

          <CommonAddressBookAutocomplete
            label={t("pincode.label")}
            name="pincode"
            required
            loading={loading}
            control={control}
            optionsKey={PINCODE}
            {...getError("pincode")}
          />

          <CommonAddressBookAutocomplete
            label={t("landmark.label")}
            name="landmark"
            loading={loading}
            control={control}
            optionsKey={LANDMARK}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <CommonAddressBookAutocomplete
            label={t("common.village")}
            name="village"
            loading={loading}
            control={control}
            optionsKey={VILLAGE}
          />

          <CommonAddressBookAutocomplete
            label={t("common.taluko")}
            name="taluko"
            loading={loading}
            control={control}
            optionsKey={TALUKO}
          />

          <CommonAddressBookAutocomplete
            label={t("common.district")}
            name="district"
            loading={loading}
            control={control}
            optionsKey={DISTRICT}
          />
        </FormGridLayout>
      </FormContainer>
    </FormSection>
  );
};
