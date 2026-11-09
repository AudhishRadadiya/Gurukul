import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import type { FamilyMemberDetail } from "@web/components/Address/address-book/FamilyMember/FamilyMemberList/hooks/useGetFamilyMember";
import type { FamilyMemberColumnHideTypes } from "@web/components/Address/address-book/template/dialogs/hooks/templateTypes";
import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";

type UseGetFamilyMemberColumnsArgs = {
  columnHide: FamilyMemberColumnHideTypes;
};

export const useGetFamilyMemberColumns = ({
  columnHide,
}: UseGetFamilyMemberColumnsArgs) => {
  const {
    age,
    alternet_mobile_no,
    birth_day_month,
    birthdate,
    contact_no,
    main_member_name,
    name,
    relation,
    remark,
  } = columnHide || {};

  const columns: AgColumnsWithActions<FamilyMemberDetail> = [
    {
      field: "contact_no",
      headerName: t("common.contact.label"),
      hide: !contact_no,
    },
    {
      field: "alternet_mobile_no",
      headerName: t("common.alternet.no"),
      hide: !alternet_mobile_no,
    },
    {
      field: "main_member_name",
      headerName: t("common.main.member"),
      hide: !main_member_name,
    },
    {
      field: "name",
      headerName: t("common.family.member.name"),
      hide: !name,
      sortable: true,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "birthdate",
      filter: "agDateColumnFilter",
      headerName: t("common.birth.date"),
      hide: !birthdate,
    },
    {
      field: "birth_day_month",
      headerName: t("common.b.day"),
      hide: !birth_day_month,
    },
    {
      field: "age",
      filter: "agNumberColumnFilter",
      headerName: t("common.age"),
      hide: !age,
    },
    {
      field: "relation",
      headerName: t("common.relation"),
      hide: !relation,
    },
    {
      field: "remark",
      headerName: t("common.remark"),
      hide: !remark,
    },
  ];

  return { columns };
};
