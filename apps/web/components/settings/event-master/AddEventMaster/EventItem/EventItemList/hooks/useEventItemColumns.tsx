import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import { getEventItemTypeLabel } from "@web/components/common/Autocomplete/hooks/useGetEventItemTypeOptions";
import type { EventItemFormFieldValues } from "@web/components/settings/event-master/AddEventMaster/EventItem/Dialog/EventItemForm";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { formatToIndianNumber } from "@web/utils/helper";

export const useEventItemColumns = () => {
  const column: AgColumnsWithActions<EventItemFormFieldValues> = [
    {
      field: "title",
      headerName: "Title",
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value
          ? AG_GRID_CELL_DEFAULT_VALUE
          : formatToIndianNumber(value);
      },
      field: "amount",
      filter: "agNumberColumnFilter",
      headerName: "Amount",
    },
    {
      field: "min_amount",
      headerName: t("common.min_amount.label"),
    },
    {
      field: "max_amount",
      headerName: t("common.max_amount.label"),
    },
    {
      field: "description",
      headerName: "Description",
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return getEventItemTypeLabel(value);
      },
      field: "type",
      headerName: "Type",
    },
    {
      field: "sequence",
      headerName: t("sequence.label"),
    },
    {
      field: "is_active",
      headerName: t("isActive.label"),
    },
    {
      field: "is_optional",
      headerName: t("isOptional.label"),
    },
  ];

  return { column };
};
