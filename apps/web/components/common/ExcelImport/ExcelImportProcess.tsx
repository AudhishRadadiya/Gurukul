import { Stack } from "@mui/material";
import type { ColDefField } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { ExcelImport } from "@web/components/common/ExcelImport/ExcelImport";
import { useExcelImportColumns } from "@web/components/common/ExcelImport/hooks/useExcelImportColumns";

export type ExcelImportProcessProps<T extends Record<string, string>> = {
  excelImportData: {
    rows: T[];
    titles: ColDefField<T>[];
  };
  excelImportFieldLabels: Record<keyof T, string>;
  name: string;
  setExcelImportData: (value: { rows: T[]; titles: (keyof T)[] }) => void;
};

export const ExcelImportProcess = <T extends FieldValues>({
  excelImportData,
  excelImportFieldLabels,
  name,
  setExcelImportData,
}: ExcelImportProcessProps<T>) => {
  const { rows, titles } = excelImportData;

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const startIndex = page * rowsPerPage;

  const endIndex = startIndex + rowsPerPage;

  const paginatedData = rows.slice(startIndex, endIndex);

  const { column } = useExcelImportColumns(titles, excelImportFieldLabels);

  return (
    <Stack gap="20px">
      <ExcelImport<T> name={name} setExcelImportData={setExcelImportData} />

      {!!rows.length && (
        <AgGridV2
          page={page}
          isLoading={false}
          columnDefs={column}
          count={rows.length}
          rowData={paginatedData}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          height={200}
          rowModelType="clientSide"
        />
      )}
    </Stack>
  );
};
