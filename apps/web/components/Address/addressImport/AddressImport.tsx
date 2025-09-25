import { Button, ContentBox, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Box, Stack } from "@mui/material";
import type { ColDefField } from "ag-grid-community";
import { t } from "i18next";
import { useRef, useState } from "react";

import type { FormRef } from "@web/components/Address/addressImport/AddressImportForm";
import { AddressImportForm } from "@web/components/Address/addressImport/AddressImportForm";
import { useAddressFieldMetadata } from "@web/components/Address/addressImport/hooks/useAddressFieldMetadata";
import {
  useAddressImport,
  type AddressImport as AddressImportFields,
  type AddressImportDetails,
} from "@web/components/Address/addressImport/hooks/useAddressImport";
import { useAddressImportFormatter } from "@web/components/Address/addressImport/hooks/useAddressImportFormatter";
import { onError } from "@web/utils/errors";

export type ExcelImportData = {
  rows: AddressImportDetails[];
  titles: ColDefField<AddressImportDetails>[];
};

export type AddressFieldMetaData = {
  data_type: string;
  db_field_name: keyof AddressImportFields;
  template_field_name: string;
};

export const AddressImport = () => {
  const formRef = useRef<FormRef>(null);

  const [excelAddressImportData, setExcelAddressImportData] =
    useState<ExcelImportData>({
      rows: [],
      titles: [],
    });

  const { isPending, mutate } = useAddressImport({
    options: {
      onError: (error) => {
        onError(error, formRef.current?.setError);

        if (error.response.data.error.erroredData) {
          setExcelAddressImportData((prev) => ({
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

  const { importAddressFieldMetadata } = useAddressFieldMetadata();

  const { transformAddressImportRow } = useAddressImportFormatter(
    importAddressFieldMetadata
  );

  const onAddressImport = () => {
    formRef.current?.submitForm(() => {
      const updatedExcelData = excelAddressImportData.rows.map((row) =>
        transformAddressImportRow(row)
      );

      const payload = {
        address_book: updatedExcelData,
      };

      mutate(payload);
    });
  };

  return (
    <Stack direction="column" gap="10px">
      <ContentBox>
        <PadBox padding={{ padding: "20px" }}>
          <AddressImportForm
            ref={formRef}
            excelAddressImportData={excelAddressImportData}
            setExcelAddressImportData={setExcelAddressImportData}
          />

          <Box display="flex" justifyContent="end">
            <Button onClick={onAddressImport} loading={isPending}>
              {t("common.save.button")}
            </Button>
          </Box>
        </PadBox>
      </ContentBox>
    </Stack>
  );
};
