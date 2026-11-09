import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { DashboardBirthdaysList } from "@web/components/Dashboard/DashboardTodayActivity/BirthdaysList/hooks/useGetDashboardBirthdaysList";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";

export const useDashboardBirthdaysColumns = () => {
  const column: AgColumnsWithActions<DashboardBirthdaysList> = [
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
      headerName: "B. Date",
      maxWidth: 120,
      minWidth: 110,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return value ? value : " -";
      },
      field: "age",
      headerName: t("common.age"),
      maxWidth: 80,
      minWidth: 70,
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
