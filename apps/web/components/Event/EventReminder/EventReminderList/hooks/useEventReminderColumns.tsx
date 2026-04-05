import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { EventReminder } from "@web/components/Event/EventReminder/EventReminderList/hooks/useGetEventReminder";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";
import { formatToIndianNumber } from "@web/utils/helper";

export const useEventReminderColumns = () => {
  const column: AgColumnsWithActions<EventReminder> = [
    {
      field: "receipt_no",
      headerName: t("common.receipt.label", {
        label: t("common.no"),
      }),
      minWidth: 130,
    },
    {
      field: "receipt_name",
      headerName: t("common.receipt.label", {
        label: t("name.label"),
      }),
      minWidth: 160,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "date",
      headerName: t("date.label"),
      minWidth: 130,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "event_reminder_date",
      headerName: t("common.reminder.label", {
        label: t("date.label"),
      }),
      minWidth: 170,
    },
    {
      field: "event_reminder_note",
      headerName: t("common.reminder.label", {
        label: t("note.label"),
      }),
      minWidth: 200,
    },
    {
      field: "trust_name",
      headerName: t("trust.label"),
      minWidth: 200,
    },
    {
      field: "event_master_name",
      headerName: t("common.event.label"),
      minWidth: 170,
    },
    {
      field: "contact_no",
      filter: "agNumberColumnFilter",
      headerName: t("common.contact.label"),
      minWidth: 170,
    },
    {
      field: "city",
      headerName: t("common.city"),
      minWidth: 130,
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
      minWidth: 130,
    },
    {
      field: "donation_mode",
      headerName: t("common.mode.label", {
        label: t("donation.menu.label"),
      }),
      minWidth: 170,
    },
  ];

  return { column };
};
