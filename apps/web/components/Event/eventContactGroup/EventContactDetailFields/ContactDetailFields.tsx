import {
  Button,
  CheckBox,
  downloadFile,
  toasts,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Download } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useMemo, type ChangeEvent } from "react";
import type { Control } from "react-hook-form";
import { useFieldArray, useFormContext } from "react-hook-form";

import { ExcelImport } from "@web/components/common/ExcelImport/ExcelImport";
import type { EventContactGroupFormFieldValues } from "@web/components/Event/eventContactGroup/Dialogs/EventContactGroupForm";
import { ContactDetailFieldsList } from "@web/components/Event/eventContactGroup/EventContactDetailFields/ContactDetailFieldsList";
import { EVENT_CONTACT_DETAIL_SAMPLE_FILE } from "@web/components/Event/eventContactGroup/EventContactDetailFields/hooks/constant";
import { useContactDetailExcelImport } from "@web/components/Event/eventContactGroup/EventContactDetailFields/hooks/useContactDetailExcelImport";
import type { ContactDetailExcelImportRow } from "@web/components/Event/eventContactGroup/EventContactDetailFields/hooks/useContactDetailImport";

type ContactDetailFieldsProps = {
  control: Control<EventContactGroupFormFieldValues>;
  loading?: boolean;
};

export const ContactDetailFields = ({
  control,
  loading = false,
}: ContactDetailFieldsProps) => {
  const { isMobile } = useGetDeviceType();

  const {
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useFormContext<EventContactGroupFormFieldValues>();

  const { append, fields, remove, replace } = useFieldArray({
    control,
    name: "contact_detail",
  });

  const { setExcelImportData } = useContactDetailExcelImport({
    replaceContactDetails: replace,
  });

  const contactDetails = watch("contact_detail");

  const isAllSelected = useMemo(() => {
    const selectableContactDetails = contactDetails.filter(
      (_, index) => index > 0
    );

    const selectedSelectableCount = selectableContactDetails.filter(
      (item) => item.selected
    ).length;

    return (
      selectableContactDetails.length > 0 &&
      selectedSelectableCount === selectableContactDetails.length
    );
  }, [JSON.stringify(contactDetails)]);

  const handleSelectAllChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;

    const currentContactDetails = getValues("contact_detail");

    const updatedContactDetails = currentContactDetails.map((item, index) => ({
      ...item,
      selected: index > 0 ? checked : false,
    }));

    setValue("contact_detail", updatedContactDetails, { shouldDirty: true });
  };

  const handleBulkDelete = () => {
    const contactDetails = getValues("contact_detail");

    const selectedIndices = contactDetails
      .map((item, index) => (item.selected ? index : -1))
      .filter((index) => index >= 0);

    if (!selectedIndices.length) {
      toasts.error({
        title: "Please select at least one contact number to delete.",
      });

      return;
    }

    if (selectedIndices.length >= contactDetails.length) {
      toasts.error({
        title: "At least one contact number is required.",
      });

      return;
    }

    const remainingContacts = contactDetails.filter(
      (_, index) => !selectedIndices.includes(index)
    );

    replace(remainingContacts);
  };

  return (
    <Stack gap={{ md: "25px", xs: "16px" }}>
      <Stack
        direction={{ md: "row", xs: "column" }}
        justifyContent="space-between"
        alignItems={{ md: "center", xs: "stretch" }}
        flexWrap="wrap"
        gap={1.25}
      >
        <Stack direction="row" gap={1.25} alignItems="center" flexWrap="wrap">
          <Button
            variant="outlined"
            onClick={handleBulkDelete}
            disabled={loading}
            size={isMobile ? "small" : "medium"}
          >
            Bulk Delete
          </Button>

          <Stack direction="row" gap="8px" alignItems="center">
            <CheckBox
              size="small"
              name="select_all"
              checked={isAllSelected}
              disabled={loading || fields.length <= 1}
              indeterminate={false}
              onChange={handleSelectAllChange}
            />

            <Typography
              variant="body2"
              fontSize={isMobile ? 13 : 15}
              fontWeight={500}
            >
              Select All
            </Typography>
          </Stack>
        </Stack>

        <Button
          startIcon={<Download height={22} width={22} />}
          onClick={() => {
            downloadFile(
              EVENT_CONTACT_DETAIL_SAMPLE_FILE,
              "event_contact_detail_sample_file.xlsx"
            );
          }}
          size={isMobile ? "small" : "medium"}
          sx={{ alignSelf: { md: "auto", xs: "flex-start" } }}
        >
          {t("sample.file.label")}
        </Button>
      </Stack>

      <ExcelImport<ContactDetailExcelImportRow>
        name="excel_file"
        setExcelImportData={setExcelImportData}
      />

      <ContactDetailFieldsList
        append={append}
        control={control}
        errors={errors}
        fields={fields}
        loading={loading}
        remove={remove}
      />
    </Stack>
  );
};
