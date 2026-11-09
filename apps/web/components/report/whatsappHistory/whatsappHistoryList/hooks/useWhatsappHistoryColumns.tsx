import { Tooltip } from "@codezee/sixtify-brahma";
import { Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { WhatsappHistory } from "@web/components/report/whatsappHistory/whatsappHistoryList/hooks/useGetWhatsappHistory";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";

export const useWhatsappHistoryColumns = () => {
  const column: AgColumnsWithActions<WhatsappHistory> = [
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value);
      },
      field: "created_at",
      filter: "agDateColumnFilter",
      headerName: "Created At",
      maxWidth: 380,
    },
    {
      field: "phone",
      headerName: "Phone",
      maxWidth: 380,
    },
    {
      field: "status",
      headerName: "Status",
      maxWidth: 280,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return (
          <Tooltip toolTipLabel={value}>
            <Typography variant="caption">
              {value ?? AG_GRID_CELL_DEFAULT_VALUE}
            </Typography>
          </Tooltip>
        );
      },
      field: "message",
      headerName: "Message",
    },
  ];

  return { column };
};
