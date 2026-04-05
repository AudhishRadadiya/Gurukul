import type { ColDef } from "ag-grid-community";
import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";
import type { FieldPath } from "react-hook-form";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { EventDonation } from "@web/components/Event/eventDonation/eventDonationList/hooks/useGetEventDonation";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
  AgDataWithActions,
} from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";
import { formatToIndianNumber } from "@web/utils/helper";

type EventDonationColumns = {
  dynamicEventItemTypes: string[];
  dynamicVariantTypes: string[];
  loading: boolean;
};

export const useEventDonationColumns = ({
  dynamicEventItemTypes,
  dynamicVariantTypes,
}: AgColumnsArgs<EventDonationColumns>) => {
  const variantColumns: ColDef<AgDataWithActions<EventDonation>>[] =
    dynamicVariantTypes.map((variantType) => {
      const fieldName =
        "event_dropdown_detail" as const satisfies FieldPath<EventDonation>;

      return {
        cellRenderer: ({ data }: CustomCellRendererProps<EventDonation>) => {
          const { event_dropdown_detail } = data ?? {};

          if (!event_dropdown_detail) {
            return "-";
          }

          const dropdownDetail = event_dropdown_detail.find(
            (detail) => detail.title === variantType
          );

          return dropdownDetail?.value ?? "-";
        },
        field: fieldName,
        headerName: variantType,
        minWidth: 150,
      };
    });

  const eventItemColumns: ColDef<AgDataWithActions<EventDonation>>[] =
    dynamicEventItemTypes.map((eventItemTitle) => {
      const fieldName =
        "event_items_detail" as const satisfies FieldPath<EventDonation>;

      return {
        cellRenderer: ({ data }: CustomCellRendererProps<EventDonation>) => {
          const { event_items_detail } = data ?? {};

          if (!event_items_detail) {
            return "-";
          }

          const itemDetail = event_items_detail.find(
            (detail) => detail.title === eventItemTitle
          );

          if (!itemDetail) {
            return "-";
          }

          if (itemDetail.kind === "event_item") {
            return itemDetail.total_amount ?? "-";
          }

          if (itemDetail.kind === "event_item_multi") {
            return itemDetail.value ?? "-";
          }

          return "-";
        },
        field: fieldName,
        headerName: eventItemTitle,
        minWidth: 150,
      };
    });

  const columns: AgColumnsWithActions<EventDonation> = [
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "date",
      headerName: t("date.label"),
      minWidth: 120,
    },
    {
      field: "receipt_no",
      headerName: t("common.receipt.label", {
        label: t("common.number.label"),
      }),
      minWidth: 170,
    },
    {
      field: "receipt_name",
      headerName: t("common.receipt.label", {
        label: t("common.name"),
      }),
      minWidth: 170,
    },
    {
      field: "event",
      headerName: t("common.event.label"),
      minWidth: 200,
    },
    {
      field: "contact_no",
      headerName: t("common.contact.label"),
      minWidth: 130,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value
          ? AG_GRID_CELL_DEFAULT_VALUE
          : formatToIndianNumber(value);
      },
      field: "amount",
      headerName: t("amount.label"),
      minWidth: 170,
    },
    {
      field: "donation_mode",
      headerName: t("donationMode.label"),
      minWidth: 150,
    },
    ...variantColumns,
    ...eventItemColumns,
    {
      field: "cheque_no",
      headerName: t("cheque.label", {
        label: t("common.number.label"),
      }),
      minWidth: 200,
    },
    {
      field: "donation_type",
      headerName: t("donation.type.label"),
      minWidth: 220,
    },
    {
      field: "remark",
      headerName: t("common.remark"),
      minWidth: 200,
    },
    {
      field: "is_cancel",
      headerName: t("is.cancel.label"),
      minWidth: 130,
    },
    {
      field: "organize_remark",
      headerName: t("organize.remark.label"),
      minWidth: 200,
    },
    {
      field: "entry_by",
      headerName: t("entry.by.label"),
      minWidth: 200,
    },

    {
      field: "edit_by",
      headerName: t("edit.by.label"),
      minWidth: 200,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "cancel_date",
      headerName: t("cancelDate.label"),
      minWidth: 120,
    },
  ];

  return { columns };
};
