import { Button, ContentBox, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Box, Stack } from "@mui/material";
import type { ColDefField } from "ag-grid-community";
import { t } from "i18next";
import { useRef, useState } from "react";

import {
  DonationImportForm,
  type FormRef,
} from "@web/components/Donation/donationImport/DonationImportForm";
import { useDonationFieldMetadata } from "@web/components/Donation/donationImport/hooks/useDonationFieldMetadata";
import type {
  DonationImport as DonationImportFields,
  DonationImportDetails,
} from "@web/components/Donation/donationImport/hooks/useDonationImport";
import { useDonationImport } from "@web/components/Donation/donationImport/hooks/useDonationImport";
import { useDonationImportFormatter } from "@web/components/Donation/donationImport/hooks/useDonationImportFormatter";
import { onError } from "@web/utils/errors";

export type ExcelImportData = {
  rows: DonationImportDetails[];
  titles: ColDefField<DonationImportDetails>[];
};

export type DonationFieldMetaData = {
  data_type: string;
  db_field_name: keyof DonationImportFields;
  template_field_name: string;
};

export const DonationImport = () => {
  const formRef = useRef<FormRef>(null);

  const [excelDonationImportData, setExcelDonationImportData] =
    useState<ExcelImportData>({
      rows: [],
      titles: [],
    });

  const { isPending, mutate } = useDonationImport({
    options: {
      onError: (error) => {
        onError(error, formRef.current?.setError);

        if (error.response.data.error.erroredData) {
          setExcelDonationImportData((prev) => ({
            ...prev,
            rows: error.response.data.error.erroredData,
          }));
        }

        toasts.error({ title: error.response.data.message });
      },

      onSuccess: (data) => {
        toasts.success({ title: data.message });
      },
    },
  });

  const { importDonationFieldMetadata } = useDonationFieldMetadata();

  const { transformDonationImportRow } = useDonationImportFormatter(
    importDonationFieldMetadata
  );

  const onDonationImport = () => {
    formRef.current?.submitForm((formValues) => {
      const updatedExcelData = excelDonationImportData.rows.map((row) =>
        transformDonationImportRow(row)
      );

      const payload = {
        ...formValues,
        donationData: updatedExcelData,
      };

      mutate(payload);
    });
  };

  return (
    <Stack direction="column" gap="10px">
      <ContentBox>
        <PadBox padding={{ padding: "20px" }}>
          <DonationImportForm
            ref={formRef}
            loading={isPending}
            excelDonationImportData={excelDonationImportData}
            setExcelDonationImportData={setExcelDonationImportData}
          />

          <Box display="flex" justifyContent="end">
            <Button onClick={onDonationImport}>
              {t("common.save.button")}
            </Button>
          </Box>
        </PadBox>
      </ContentBox>
    </Stack>
  );
};
