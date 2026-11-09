import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { UserLoginReport } from "@web/components/user/userLoginReport/userLoginReportList/hooks/userGetUserLoginReport";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";

export const useUserLoginReportColumns = () => {
  const column: AgColumnsWithActions<UserLoginReport> = [
    {
      field: "user_name",
      headerName: t("common.name.label", {
        label: t("common.user.label"),
      }),
      minWidth: 120,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value);
      },
      field: "login_time",
      filter: "agDateColumnFilter",
      headerName: t("common.login.time"),
      minWidth: 160,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "logout_time",
      filter: "agDateColumnFilter",
      headerName: t("common.logout.time"),
      minWidth: 160,
    },
    {
      field: "mac_address",
      headerName: t("common.mac.address"),
      minWidth: 140,
    },
    {
      field: "ip_address",
      headerName: t("common.ip.address"),
      minWidth: 120,
    },
    {
      field: "remark",
      headerName: t("common.remark"),
      minWidth: 140,
    },
  ];

  return { column };
};
