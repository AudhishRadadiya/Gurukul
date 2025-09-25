import { Chip, Tooltip } from "@codezee/sixtify-brahma";
import { Typography, useTheme } from "@mui/material";
import type { ColDefField } from "ag-grid-community";
import type { CustomCellRendererProps } from "ag-grid-react";
import _get from "lodash/get";
import _isBoolean from "lodash/isBoolean";
import type { FieldValues } from "react-hook-form";

import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useExcelImportColumns = <
  T extends FieldValues & { error?: FieldValues },
>(
  columnTitles: ColDefField<T>[],
  excelImportFieldLabels: Record<keyof T, string>
) => {
  const theme = useTheme();

  const { lipstickRed } = theme.palette.app.color;

  const column: AgColumnsWithActions<T> = columnTitles.map((title) => {
    return {
      cellRenderer: ({ data }: CustomCellRendererProps) => {
        const cellValue = _get(data, title);

        const errorValue = _get(data, ["error", title]);

        if (_isBoolean(cellValue)) {
          return (
            <Chip
              label={cellValue ? "Yes" : "No"}
              color={cellValue ? "success" : "error"}
              size="small"
              variant="outlined"
              sx={{ minWidth: "50px" }}
            />
          );
        }

        return (
          <Tooltip toolTipLabel={errorValue}>
            <Typography variant="body2">{cellValue}</Typography>
          </Tooltip>
        );
      },

      cellStyle: (params) => {
        return (
          _get(params, ["data", "error", title]) && {
            backgroundColor: lipstickRed[700],
          }
        );
      },
      field: title,
      headerName: excelImportFieldLabels[title],
    };
  });

  return { column };
};
