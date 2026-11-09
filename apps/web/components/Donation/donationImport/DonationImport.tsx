import { Button, ContentBox, PadBox, toasts, useGetDeviceType } from "@codezee/sixtify-brahma";
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

  const { isMobile } = useGetDeviceType();

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
    <Stack direction="column" gap={{ sm: "10px", xs: "8px" }}>
      <ContentBox>
        <PadBox padding={{ padding: { sm: "20px", xs: "12px" } }}>
          <DonationImportForm
            ref={formRef}
            loading={isPending}
            excelDonationImportData={excelDonationImportData}
            setExcelDonationImportData={setExcelDonationImportData}
          />

          <Box
            display="flex"
            justifyContent={{ sm: "flex-end", xs: "stretch" }}
            sx={{ mt: { sm: 0, xs: 1 } }}
          >
            <Button
              size={isMobile ? "small" : "medium"}
              onClick={onDonationImport}
              sx={{ width: { sm: "auto", xs: "100%" } }}
            >
              {t("common.save.button")}
            </Button>
          </Box>
        </PadBox>
      </ContentBox>
    </Stack>
  );
};
