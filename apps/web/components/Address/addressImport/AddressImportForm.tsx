import { Button, FormSection } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Stack } from "@mui/material";
import type { ColDefField } from "ag-grid-community";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { FormProvider, useForm, type UseFormSetError } from "react-hook-form";
import { z } from "zod";

import {
  addressFieldLabels,
  SAMPLE_FILE,
} from "@web/components/Address/addressImport/hooks/constant";
import type { AddressImportDetails } from "@web/components/Address/addressImport/hooks/useAddressImport";
import { ExcelImportProcess } from "@web/components/common/ExcelImport/ExcelImportProcess";
import { useFileDownload } from "@web/components/common/useFileDownload";

const AddressImportFormSchema = z
  .object({
    excel_file: z.instanceof(File).nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data.excel_file) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["excel_file"],
      });
    }
  });

export type AddressImportFormFieldValues = z.infer<
  typeof AddressImportFormSchema
>;

const formDefaultValues: AddressImportFormFieldValues = {
  excel_file: null,
};

type AddressImportFormArgs = {
  defaultValues?: AddressImportFormFieldValues;
  excelAddressImportData: {
    rows: AddressImportDetails[];
    titles: ColDefField<AddressImportDetails>[];
  };
  setExcelAddressImportData: (value: {
    rows: AddressImportDetails[];
    titles: (keyof AddressImportDetails)[];
  }) => void;
};

export type FormRef = {
  setError: UseFormSetError<AddressImportFormFieldValues>;
  submitForm: (onSubmit: () => void) => void;
};

export const AddressImportForm = forwardRef(
  (
    {
      excelAddressImportData,
      setExcelAddressImportData,
    }: AddressImportFormArgs,
    ref: ForwardedRef<FormRef>
  ) => {
    const methods = useForm({
      mode: "all",
      resolver: zodResolver(AddressImportFormSchema),
      values: formDefaultValues,
    });

    const { handleSubmit, setError } = methods;

    const { downloadFile } = useFileDownload();

    useImperativeHandle(ref, () => ({
      setError,

      submitForm(onSubmit) {
        handleSubmit(() => {
          onSubmit();
        })();
      },
    }));

    return (
      <FormProvider {...methods}>
        <FormSection title={t("address.import.label")}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={() => {
                downloadFile(SAMPLE_FILE, "address_sample_file.xlsx");
              }}
            >
              {t("sample.file.label")}
            </Button>
          </Stack>
        </FormSection>

        <FormSection>
          <Stack gap="25px">
            <ExcelImportProcess<AddressImportDetails>
              name="excel_file"
              excelImportFieldLabels={addressFieldLabels}
              excelImportData={excelAddressImportData}
              setExcelImportData={setExcelAddressImportData}
            />
          </Stack>
        </FormSection>
      </FormProvider>
    );
  }
);

AddressImportForm.displayName = "AddressImportForm";
