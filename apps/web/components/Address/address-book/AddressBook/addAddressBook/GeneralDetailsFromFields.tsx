import {
  FormContainer,
  FormGridLayout,
  FormSection,
  TextField,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useFormContext } from "react-hook-form";

import type { AddressBookFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";
import { CommonMasterTypeParametersAutocomplete } from "@web/components/common/Autocomplete/CommonMasterTypeParametersAutocomplete";
import {
  BUSINESS,
  EDUCATION,
  HASTAK,
  ZONE,
} from "@web/components/common/hooks/constant";

type GeneralDetailsFromFieldsProps = {
  loading?: boolean;
};

export const GeneralDetailsFromFields = ({
  loading = false,
}: GeneralDetailsFromFieldsProps) => {
  const { control } = useFormContext<AddressBookFormFieldValues>();

  return (
    <FormSection title={t("common.general.details")}>
      <FormContainer>
        <FormGridLayout columns={3}>
          <CommonMasterTypeParametersAutocomplete
            label={t("education.label")}
            name="education_parameter_id"
            loading={loading}
            control={control}
            optionsKey={EDUCATION}
          />

          <CommonMasterTypeParametersAutocomplete
            label={t("business.label")}
            name="business_parameter_id"
            loading={loading}
            control={control}
            optionsKey={BUSINESS}
          />

          <TextField
            name="b_note"
            loading={loading}
            control={control}
            label={t("b.note.label")}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <CommonMasterTypeParametersAutocomplete
            label={t("common.saints.hastak")}
            name="saints_hastak_parameter_id"
            loading={loading}
            control={control}
            optionsKey={HASTAK}
          />

          <CommonMasterTypeParametersAutocomplete
            label={t("common.hastak.1")}
            name="hastak_1_parameter_id"
            loading={loading}
            control={control}
            optionsKey={HASTAK}
          />

          <CommonMasterTypeParametersAutocomplete
            label={t("common.hastak.2")}
            name="hastak_2_parameter_id"
            loading={loading}
            control={control}
            optionsKey={HASTAK}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <CommonMasterTypeParametersAutocomplete
            label={t("common.zone")}
            name="zone_parameter_id"
            loading={loading}
            control={control}
            optionsKey={ZONE}
          />

          <TextField
            name="note"
            loading={loading}
            control={control}
            label={t("note.label")}
          />
        </FormGridLayout>
      </FormContainer>
    </FormSection>
  );
};
