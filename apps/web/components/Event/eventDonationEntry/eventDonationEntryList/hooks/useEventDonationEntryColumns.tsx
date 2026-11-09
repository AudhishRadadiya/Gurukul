import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { EventDonationEntry } from "@web/components/Event/eventDonationEntry/eventDonationEntryList/hooks/useGetEventDonationEntry";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";
import { formatToIndianNumber } from "@web/utils/helper";

export const useEventDonationEntryColumns = () => {
  const column: AgColumnsWithActions<EventDonationEntry> = [
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "date",
      filter: "agDateColumnFilter",
      headerName: t("date.label"),
    },
    {
      field: "donar_name",
      headerName: t("common.donar.name"),
    },
    {
      field: "donar_contact_no",
      headerName: t("common.donar.contact.no"),
      minWidth: 150,
    },
    {
      field: "hastak_name",
      headerName: t("common.hastak.name"),
    },
    {
      field: "hastak_contact_no",
      headerName: t("common.hastak.contact.no"),
      minWidth: 150,
    },
    {
      field: "event_master_name",
      headerName: t("common.event.master.name"),
      minWidth: 150,
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
    {
      field: "received_amount",
      filter: "agNumberColumnFilter",
      headerName: t("common.received.amount"),
    },
    {
      field: "remark",
      headerName: t("common.remark"),
    },
    {
      field: "address",
      headerName: t("address.label"),
    },
    {
      field: "city",
      headerName: t("common.city"),
    },
  ];

  return { column };
};
