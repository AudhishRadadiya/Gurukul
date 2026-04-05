import {
  CheckBox,
  FormContainer,
  FormGridLayout,
  FormSection,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useFormContext } from "react-hook-form";

import type { AddressBookFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";
import { AddressTypeAutocomplete } from "@web/components/common/Autocomplete/AddressTypeAutocomplete";
import { ClassMateAutocomplete } from "@web/components/common/Autocomplete/ClassMateAutocomplete";
import { CommonMasterTypeParametersAutocomplete } from "@web/components/common/Autocomplete/CommonMasterTypeParametersAutocomplete";
import { CATEGORY, GURUKUL } from "@web/components/common/hooks/constant";
import { errorMessages } from "@web/utils/helper";

type PastStudentFromFieldsProps = {
  loading?: boolean;
};

export const PastStudentFromFields = ({
  loading = false,
}: PastStudentFromFieldsProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AddressBookFormFieldValues>();

  const { address_type_id } = errors;

  return (
    <FormSection title={t("common.past.student")}>
      <FormContainer>
        <FormGridLayout columns={3}>
          <AddressTypeAutocomplete
            label={t("common.address.type")}
            name="address_type_id"
            loading={loading}
            control={control}
            required
            error={!!address_type_id}
            helperText={errorMessages(address_type_id?.message)}
          />

          <CommonMasterTypeParametersAutocomplete
            label={t("common.category.1")}
            name="category_1_parameters_id"
            loading={loading}
            control={control}
            optionsKey={CATEGORY}
          />

          <CommonMasterTypeParametersAutocomplete
            label={t("common.category.2")}
            name="category_1_parameters_id"
            loading={loading}
            control={control}
            optionsKey={CATEGORY}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <CommonMasterTypeParametersAutocomplete
            label={t("common.gurukul")}
            name="gurukul_parameters_id"
            loading={loading}
            control={control}
            optionsKey={GURUKUL}
          />

          <TextField
            name="ssc_year"
            loading={loading}
            control={control}
            label={t("common.ssc.year")}
          />

          <CommonMasterTypeParametersAutocomplete
            label={t("common.ssc.gurukul")}
            name="ssc_gurukul"
            loading={loading}
            control={control}
            optionsKey={GURUKUL}
          />
        </FormGridLayout>

        <Stack direction="row" gap="10px" justifyContent="space-between">
          <Stack direction="row" gap="10px" alignItems="center">
            <Typography fontSize={15}>{t("common.is.vip")}</Typography>

            <CheckBox name="is_vip" control={control} size="small" />
          </Stack>

          <Stack direction="row" gap="10px" alignItems="center">
            <Typography fontSize={15}>{t("common.patrika")}</Typography>

            <RadioGroupField
              name="patrika"
              control={control}
              loading={loading}
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
          </Stack>

          <Stack direction="row" gap="10px" alignItems="center">
            <Typography fontSize={15}>{t("common.leave.in")}</Typography>

            <RadioGroupField
              name="leave_in"
              control={control}
              loading={loading}
              options={[
                {
                  disabled: false,
                  label: t("common.school.label"),
                  values: 1,
                },
                {
                  disabled: false,
                  label: t("common.hostel.label"),
                  values: 2,
                },
              ]}
            />
          </Stack>

          <Stack direction="row" gap="10px" alignItems="center">
            <Typography fontSize={15}>{t("common.medium")}</Typography>

            <RadioGroupField
              name="medium"
              control={control}
              loading={loading}
              options={[
                {
                  disabled: false,
                  label: t("common.gujarati.label"),
                  values: 1,
                },
                {
                  disabled: false,
                  label: t("common.english.label"),
                  values: 2,
                },
              ]}
            />
          </Stack>

          <Stack direction="row" gap="10px" alignItems="center">
            <Typography fontSize={15}>{t("common.is.past.student")}</Typography>

            <CheckBox name="is_past_student" control={control} size="small" />
          </Stack>
        </Stack>

        <FormGridLayout columns={3}>
          <ClassMateAutocomplete
            name="class_mate"
            loading={loading}
            control={control}
          />
        </FormGridLayout>
      </FormContainer>
    </FormSection>
  );
};
