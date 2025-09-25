import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import type { FamilyMemberFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/familyMemberDetail/Dialog/FamilyMemberForm";
import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";

export const useFamilyMemberColumns = () => {
  const column: AgColumnsWithActions<FamilyMemberFormFieldValues> = [
    {
      field: "name",
      headerName: t("common.name"),
    },
    {
      field: "relation",
      headerName: t("common.relation"),
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "birthdate",
      headerName: t("common.birth.date"),
    },
    {
      field: "remark",
      headerName: t("remark.label"),
    },
  ];

  return { column };
};
