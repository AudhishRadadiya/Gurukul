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
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value);
      },
      field: "login_time",
      headerName: t("common.login.time"),
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "logout_time",
      headerName: t("common.logout.time"),
    },
    {
      field: "mac_address",
      headerName: t("common.mac.address"),
    },
    {
      field: "ip_address",
      headerName: t("common.ip.address"),
    },
    {
      field: "remark",
      headerName: t("common.remark"),
    },
  ];

  return { column };
};
