import {
  DatePicker,
  FormContainer,
  FormGridLayout,
  FormSection,
  GridProvider,
  TextField,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";

import type { AddressBookFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";
import { CommonAddressBookAutocomplete } from "@web/components/Address/address-book/AddressBook/addAddressBook/CommonAddressBookAutocomplete";
import { BloodGroupAutocomplete } from "@web/components/common/Autocomplete/BloodGroupAutocomplete";
import { CityAutocomplete } from "@web/components/common/Autocomplete/CityAutocomplete";
import { GenderAutocomplete } from "@web/components/common/Autocomplete/GenderAutocomplete";
import { StateAutocomplete } from "@web/components/common/Autocomplete/StateAutocomplete";
import {
  CONTACT_NO,
  DISTRICT,
  FIRST_NAME,
  MIDDLE_NAME,
  PINCODE,
  SURNAME,
  TALUKO,
  VILLAGE,
} from "@web/components/common/hooks/constant";
import { ImageUploadField } from "@web/components/common/ImageUploadField";
import { PanCardTextField } from "@web/components/common/PanCardTextField/PanCardTextField";
import { usePostCityAndStateFromPinCode } from "@web/hooks/address/usePostCityAndStateFromPinCode";
import { Debounce_Delay, errorMessages } from "@web/utils/helper";

type AddressBookFromFieldsProps = {
  loading?: boolean;
};

export const AddressBookFromFields = ({
  loading = false,
}: AddressBookFromFieldsProps) => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<AddressBookFormFieldValues>();

  const pincode = watch("pincode");

  const getError = (name: keyof AddressBookFormFieldValues) => ({
    error: !!errors[name],
    helperText: errorMessages(errors[name]?.message),
  });

  const [pincodeInput] = useDebounceValue(pincode, Debounce_Delay);

  const { data: locationData } = usePostCityAndStateFromPinCode({
    pinCode: !errors.pincode && pincodeInput ? pincodeInput : "",
  });

  const isLocationFromPincode = useMemo(
    () =>
      !!pincode &&
      pincode === pincodeInput &&
      !errors.pincode &&
      !!locationData?.city &&
      !!locationData.state,
    [
      errors.pincode,
      locationData?.city,
      locationData?.state,
      pincode,
      pincodeInput,
    ]
  );

  const { city, state } = useMemo<
    Pick<AddressBookFormFieldValues, "city" | "state">
  >(() => {
    return {
      city: locationData?.city ?? null,
      state: locationData?.state ?? null,
    };
  }, [locationData]);

  useMemo(() => {
    setValue("city", city, { shouldValidate: true });

    setValue("state", state, { shouldValidate: true });
  }, [city, state]);

  return (
    <FormSection title={t("address.book.menu.label")}>
      <FormContainer>
        <GridProvider
          columns={4}
          columnsOnSmallDevice={1}
          columnsOnTablet={1}
          gap={1}
        >
          <GridProvider columns={1} gap={1} sx={{ gridRow: { lg: "span 2" } }}>
            <ImageUploadField
              control={control}
              name="logo"
              loading={loading}
              label=""
            />
          </GridProvider>

          <GridProvider
            columns={3}
            gap={1.5}
            sx={{ gridColumn: { lg: "span 3" } }}
          >
            <CommonAddressBookAutocomplete
              createOptionOnType
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
              disabled
              required
              loading={loading}
              control={control}
              characterType="any-character"
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

            <CommonAddressBookAutocomplete
              loading={loading}
              createOptionOnType
              label={t("yourName.label")}
              freeSolo
              name="first_name"
              characterType="string"
              required
              control={control}
              optionsKey={FIRST_NAME}
              {...getError("first_name")}
            />

            <CommonAddressBookAutocomplete
              loading={loading}
              createOptionOnType
              label={t("fatherName.label")}
              name="middle_name"
              characterType="string"
              freeSolo
              control={control}
              optionsKey={MIDDLE_NAME}
            />

            <CommonAddressBookAutocomplete
              loading={loading}
              createOptionOnType
              label={t("common.surname")}
              name="surname"
              characterType="string"
              freeSolo
              required
              control={control}
              optionsKey={SURNAME}
              {...getError("surname")}
            />
          </GridProvider>
        </GridProvider>

        <FormGridLayout columns={3}>
          <TextField
            name="email_id"
            letterCase="lowercase"
            characterType="string-number-special"
            loading={loading}
            control={control}
            label={t("email.label")}
            {...getError("email_id")}
          />

          <TextField
            name="alternet_mobile_no"
            loading={loading}
            control={control}
            maxLength={10}
            characterType="string-number"
            label={t("common.alternet.no")}
            {...getError("alternet_mobile_no")}
          />

          <PanCardTextField
            name="pan_no"
            loading={loading}
            placeholder={t("common.pan.no.placeholder")}
            control={control}
            label={t("common.pan.no")}
            {...getError("pan_no")}
          />

          {/* <TextField
            name="driving_licence_no"
            loading={loading}
            placeholder={t("dl.no.label.placeholder")}
            control={control}
            isCapitalize
            label={t("license.no.label")}
            {...getError("driving_licence_no")}
          /> */}
        </FormGridLayout>

        {/* <FormGridLayout columns={3}>
          <TextField
            name="aadhar_no"
            loading={loading}
            control={control}
            placeholder={t("aadhar.no.label.placeholder")}
            label={t("aadhar.no.label")}
            {...getError("aadhar_no")}
          />

          <TextField
            name="elector_number"
            placeholder={t("common.elector.no.placeholder")}
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
            placeholder={t("common.passport.no.placeholder")}
            isCapitalize
            label={t("common.passport.no")}
            {...getError("passport_no")}
          />
        </FormGridLayout> */}

        <FormGridLayout columns={4}>
          <DatePicker
            control={control}
            label={t("common.birth.date")}
            name="birth_date"
            loading={loading}
            clearable={false}
          />

          <DatePicker
            control={control}
            label={t("common.anniversary.date")}
            name="anniversary_date"
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
            isCapitalize
            label={t("address.label")}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <CommonAddressBookAutocomplete
            label={t("pincode.label")}
            name="pincode"
            createOptionOnType
            required
            freeSolo
            loading={loading}
            control={control}
            optionsKey={PINCODE}
            {...getError("pincode")}
          />

          <CityAutocomplete
            label={t("common.city")}
            createOptionOnType
            freeSolo
            name="city"
            loading={loading}
            control={control}
            disabled={isLocationFromPincode}
          />

          <StateAutocomplete
            name="state"
            control={control}
            loading={loading}
            disabled={isLocationFromPincode}
          />

          {/* <CommonAddressBookAutocomplete
            label={t("landmark.label")}
            createOptionOnType
            name="landmark"
            freeSolo
            loading={loading}
            control={control}
            optionsKey={LANDMARK}
          /> */}
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <CommonAddressBookAutocomplete
            label={t("common.village")}
            createOptionOnType
            name="village"
            freeSolo
            loading={loading}
            control={control}
            optionsKey={VILLAGE}
          />

          <CommonAddressBookAutocomplete
            label={t("common.taluko")}
            createOptionOnType
            name="taluko"
            freeSolo
            loading={loading}
            control={control}
            optionsKey={TALUKO}
          />

          <CommonAddressBookAutocomplete
            label={t("common.district")}
            name="district"
            createOptionOnType
            freeSolo
            loading={loading}
            control={control}
            optionsKey={DISTRICT}
          />
        </FormGridLayout>
      </FormContainer>
    </FormSection>
  );
};
