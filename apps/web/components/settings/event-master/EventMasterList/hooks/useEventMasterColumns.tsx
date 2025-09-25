import { Tooltip } from "@codezee/sixtify-brahma";
import { Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { EventMasterDetail } from "@web/components/settings/event-master/EventMasterList/hooks/useGetEventMaster";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";

export const useEventMasterColumns = () => {
  const column: AgColumnsWithActions<EventMasterDetail> = [
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return (
          <Tooltip toolTipLabel={value}>
            <Typography variant="body2">{value}</Typography>
          </Tooltip>
        );
      },
      field: "event_master_name",
      headerName: t("common.name.label", {
        label: t("common.event.label"),
      }),
      minWidth: 200,
    },
    {
      field: "location",
      headerName: t("location.label"),
      minWidth: 200,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "start_date",
      headerName: t("startDate.label"),
      minWidth: 130,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "end_date",
      headerName: t("endDate.label"),
      minWidth: 130,
    },
    {
      field: "trust_names",
      headerName: t("trustNames.label"),
      minWidth: 130,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return (
          <Tooltip toolTipLabel={value}>
            <Typography variant="body2">{value ?? "-"}</Typography>
          </Tooltip>
        );
      },
      field: "description",
      headerName: t("description.label"),
      minWidth: 200,
    },
    {
      field: "is_send_sms",
      headerName: t("isSendSMS.label"),
    },
    {
      field: "is_need_reminder",
      headerName: t("isNeedReminder.label"),
    },
    {
      field: "is_active",
      headerName: t("isActive.label"),
    },
    {
      field: "is_online",
      headerName: t("isOnline.label"),
    },
    {
      field: "branch_name",
      minWidth: 200,
    },
  ];

  return { column };
};
