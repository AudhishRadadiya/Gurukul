import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import type { EventDropdownFormFieldValues } from "@web/components/settings/event-master/AddEventMaster/EventDropdown/Dialog/EventDropdownForm";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useEventDropdownColumns = () => {
  const column: AgColumnsWithActions<EventDropdownFormFieldValues> = [
    {
      field: "title",
      headerName: t("title.label"),
      width: 200,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (!value || value.length === 0) {
          return "-";
        }

        return value.join(", ");
      },
      field: "values",
      headerName: t("title.values"),
      width: 400,
    },
    {
      field: "sequence",
      headerName: t("sequence.label"),
    },
    {
      field: "description",
      headerName: t("description.label"),
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
