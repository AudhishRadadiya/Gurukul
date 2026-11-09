import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { CurrencyData } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/dialog/hooks/useGetCurrencyDetail";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { formatToIndianNumber } from "@web/utils/helper";

export const useCurrencyDetailColumns = () => {
  const column: AgColumnsWithActions<CurrencyData> = [
    {
      field: "currency",
      headerName: t("currency.detail.currency"),
    },
    {
      field: "qty",
      headerName: t("currency.detail.qty"),
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value
          ? AG_GRID_CELL_DEFAULT_VALUE
          : formatToIndianNumber(value);
      },
      field: "amount",
      filter: "agNumberColumnFilter",
      headerName: t("currency.detail.amount"),
    },
  ];

  return { column };
};
