import { toasts, FileNames, FileUpload } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import _every from "lodash/every";
import { useMemo } from "react";
import type { FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { errorMessages } from "@web/utils/helper";
import { readExcel } from "@web/utils/readExcelFile";

const excelFileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export type ExcelImportProps<T extends FieldValues> = {
  name: string;
  required?: boolean;
  setExcelImportData: (value: { rows: T[]; titles: string[] }) => void;
};

export const ExcelImport = <T extends FieldValues>({
  name,
  required: isRequired = false,
  setExcelImportData,
}: ExcelImportProps<T>) => {
  const {
    control,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useFormContext();

  const fieldValue = watch(name);

  const handleFileChange = async (file: File) => {
    if (excelFileType !== file.type) {
      toasts.error({ title: t("common.excel.fileType.invalid") });
    }

    const data: { rows: T[]; titles: string[] } = await readExcel(file);

    if (data) {
      const allValuesEmpty = _every(
        data.rows[0],
        (value) => !value || value === ""
      );

      if (allValuesEmpty) {
        toasts.error({ title: t("common.excel.dataNotFound") });
      }

      setValue(name, !allValuesEmpty ? file : null, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setExcelImportData(data);

      return data;
    }

    setExcelImportData({ rows: [], titles: [] });

    setValue(name, null, { shouldValidate: true });

    window.alert("Error reading Excel file.");
  };

  //   Use for get a excel file name
  const names: string[] = useMemo(() => {
    if (fieldValue && fieldValue instanceof File) {
      return [fieldValue.name];
    }

    return [];
  }, [fieldValue]);

  return (
    <Stack gap="20px">
      <FileUpload
        name={name}
        control={control}
        label={t("common.import.excel")}
        acceptTitle="Supported formates: Only XLS, XLSX files are accepted."
        size={5}
        required={isRequired}
        accept={[
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ]}
        onChange={(file) => {
          if (file[0]) {
            handleFileChange(file[0]);
          }
        }}
        setError={setError}
        fileNames={
          <FileNames
            fileNames={names}
            onDelete={() => {
              setValue(name, null, {
                shouldDirty: true,
                shouldValidate: true,
              });

              setExcelImportData({ rows: [], titles: [] });
            }}
          />
        }
        error={!!errors[name]}
        helperText={errorMessages(
          typeof errors?.[name]?.message === "string"
            ? errors?.[name]?.message
            : undefined
        )}
      />
    </Stack>
  );
};
