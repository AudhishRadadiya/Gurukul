import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { DashboardAnniversariesList } from "@web/components/Dashboard/DashboardTodayActivity/AnniversariesList/hooks/useGetDashboardAnniversariesList";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";

export const useDashboardAnniversariesColumns = () => {
  const column: AgColumnsWithActions<DashboardAnniversariesList> = [
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return value ? value : " -";
      },
      field: "full_name",
      headerName: t("name.label"),
      minWidth: 300,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return value ? value : "-";
      },
      field: "contact_no",
      headerName: t("common.contact.label"),
      maxWidth: 130,
      minWidth: 120,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "date",
      headerName: "A. Date",
      maxWidth: 120,
      minWidth: 110,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return value ? value : " -";
      },
      field: "total_years",
      headerName: t("years.label"),
      maxWidth: 100,
      minWidth: 90,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return value ? value : " -";
      },
      field: "branch_name",
      headerName: t("branch.label"),
      maxWidth: 110,
      minWidth: 100,
    },
  ];

  return { column };
};
