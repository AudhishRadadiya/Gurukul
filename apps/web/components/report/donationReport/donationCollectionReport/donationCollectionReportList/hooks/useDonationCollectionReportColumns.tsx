import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { DailyDonationReportData } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/hooks/useGetDonationCollectionReport";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";
import { formatToIndianNumber } from "@web/utils/helper";

export const useDonationCollectionReportColumns = () => {
  const column: AgColumnsWithActions<DailyDonationReportData> = [
    {
      field: "user_name",
      headerName: t("common.user.name"),
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "date",
      filter: "agDateColumnFilter",
      headerName: t("date.label"),
    },

    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value
          ? AG_GRID_CELL_DEFAULT_VALUE
          : formatToIndianNumber(value);
      },
      field: "amount",
      filter: "agNumberColumnFilter",
      headerName: t("amount.label"),
    },
  ];

  return { column };
};
