import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import type { AddressBookDetails } from "@web/components/Address/address-book/AddressBook/AddressBookList/hooks/useGetAddressBook";
import type { AddressBookColumnHideTypes } from "@web/components/Address/address-book/template/dialogs/hooks/templateTypes";
import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import { useGetIsActiveOptions } from "@web/components/common/hooks/useGetIsActiveOptions";
import type { AgColumnsArgs, AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";

type UseGetAddressBookColumnsArgs = {
  columnHide: AddressBookColumnHideTypes;
};

export const useGetAddressBookColumns = ({
  columnHide,
}: AgColumnsArgs<UseGetAddressBookColumnsArgs>) => {
  const {
    address,
    address_type,
    adhar_no,
    alternet_mobile_no,
    anniversary_date,
    anniversary_day,
    b_note,
    bday,
    birth_date,
    blood_group,
    business_name,
    category1_name,
    category2_name,
    city,
    class_mate,
    contact_no,
    district,
    driving_licence_no,
    education_name,
    electors_number,
    family_member,
    first_name,
    g_no,
    gender,
    gurukul_name,
    hastak1_name,
    hastak2_name,
    is_past_student,
    is_vip,
    leave_in,
    medium,
    middle_name,
    note,
    pan_no,
    passport_no,
    patrika,
    pincode,
    saint_name,
    ssc_gurukul,
    ssc_year,
    surname,
    taluko,
    village,
    zone_name,
  } = columnHide || {};

  const { isActiveOptions } = useGetIsActiveOptions();

  const columns: AgColumnsWithActions<AddressBookDetails> = [
    {
      field: "contact_no",
      headerName: t("common.contact.label"),
      hide: !contact_no,
      minWidth: 150,
    },
    {
      field: "g_no",
      headerName: t("common.g.no"),
      hide: !g_no,
      minWidth: 100,
    },
    {
      field: "surname",
      headerName: t("common.surname"),
      hide: !surname,
      minWidth: 150,
    },
    {
      field: "first_name",
      headerName: t("common.first.name"),
      hide: !first_name,
      minWidth: 150,
    },
    {
      field: "middle_name",
      headerName: t("common.middle.name"),
      hide: !middle_name,
      minWidth: 150,
    },
    {
      field: "pan_no",
      headerName: t("common.pan.no"),
      hide: !pan_no,
      minWidth: 180,
    },
    {
      field: "address",
      headerName: t("common.address"),
      hide: !address,
      minWidth: 200,
    },
    {
      field: "leave_in",
      headerName: t("common.locality"),
      hide: !leave_in,
      minWidth: 150,
    },
    {
      field: "pincode",
      headerName: t("common.zip.code"),
      hide: !pincode,
      minWidth: 150,
    },
    {
      field: "city",
      headerName: t("common.city"),
      hide: !city,
      minWidth: 100,
    },
    {
      field: "village",
      headerName: t("common.village"),
      hide: !village,
      minWidth: 120,
    },
    {
      field: "address_type",
      headerName: t("common.address.type"),
      hide: !address_type,
      minWidth: 100,
    },
    {
      field: "taluko",
      headerName: t("common.taluko"),
      hide: !taluko,
      minWidth: 100,
    },
    {
      field: "blood_group",
      headerName: t("common.blood.group"),
      hide: !blood_group,
      minWidth: 100,
    },
    {
      field: "district",
      headerName: t("common.district"),
      hide: !district,
      minWidth: 100,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "birth_date",
      headerName: t("common.birth.date"),
      hide: !birth_date,
      minWidth: 100,
    },
    {
      field: "bday",
      headerName: t("common.b.day"),
      hide: !bday,
      minWidth: 100,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "anniversary_date",
      headerName: t("common.anniversary.date"),
      hide: !anniversary_date,
      minWidth: 150,
    },
    {
      field: "alternet_mobile_no",
      headerName: t("common.alternet.no"),
      hide: !alternet_mobile_no,
      minWidth: 150,
    },
    {
      field: "is_vip",
      headerName: t("common.is.vip"),
      hide: !is_vip,
      minWidth: 80,
    },
    {
      field: "category1_name",
      headerName: t("common.category.1"),
      hide: !category1_name,
      minWidth: 200,
    },
    {
      field: "category2_name",
      headerName: t("common.category.2"),
      hide: !category2_name,
      minWidth: 200,
    },
    {
      field: "anniversary_day",
      headerName: t("common.ani.day"),
      hide: !anniversary_day,
      minWidth: 200,
    },
    {
      field: "hastak1_name",
      headerName: t("common.hastak.1"),
      hide: !hastak1_name,
      minWidth: 200,
    },
    {
      field: "hastak2_name",
      headerName: t("common.hastak.2"),
      hide: !hastak2_name,
      minWidth: 200,
    },
    {
      field: "zone_name",
      headerName: t("common.zone"),
      hide: !zone_name,
      minWidth: 150,
    },
    {
      field: "b_note",
      headerName: t("common.business.note"),
      hide: !b_note,
      minWidth: 100,
    },
    {
      field: "patrika",
      headerName: t("common.patrika"),
      hide: !patrika,
      minWidth: 100,
    },
    {
      field: "note",
      headerName: t("common.note"),
      hide: !note,
      minWidth: 150,
    },
    {
      field: "business_name",
      headerName: t("common.business.name"),
      hide: !business_name,
      minWidth: 150,
    },
    {
      field: "is_past_student",

      filterParams: {
        filterOptions: isActiveOptions,
        source: "note",
      },
      headerName: t("common.is.past.student"),
      hide: !is_past_student,
      minWidth: 100,
    },
    {
      field: "gurukul_name",
      headerName: "Gurukul Name",
      hide: !gurukul_name,
      minWidth: 200,
    },
    {
      field: "ssc_year",
      headerName: t("common.ssc.year"),
      hide: !ssc_year,
      minWidth: 100,
    },
    {
      field: "ssc_gurukul",
      headerName: t("common.ssc.gurukul"),
      hide: !ssc_gurukul,
      minWidth: 200,
    },
    {
      field: "leave_in",
      headerName: t("common.leave.in"),
      hide: !leave_in,
      minWidth: 100,
    },
    {
      field: "medium",
      headerName: t("common.medium"),
      hide: !medium,
      minWidth: 100,
    },
    {
      field: "class_mate",
      headerName: t("common.class.mate"),
      hide: !class_mate,
      minWidth: 150,
    },
    {
      field: "education_name",
      headerName: t("common.qualification"),
      hide: !education_name,
      minWidth: 200,
    },
    {
      field: "saint_name",
      headerName: "Saint",
      hide: !saint_name,
      minWidth: 200,
    },
    {
      field: "family_member",
      headerName: t("common.family.member"),
      hide: !family_member,
      minWidth: 200,
    },
    {
      field: "gender",
      headerName: t("common.gender"),
      hide: !gender,
      minWidth: 100,
    },
    {
      field: "adhar_no",
      headerName: t("common.adhar.no"),
      hide: !adhar_no,
      minWidth: 200,
    },
    {
      field: "driving_licence_no",
      headerName: t("common.dlno"),
      hide: !driving_licence_no,
      minWidth: 200,
    },
    {
      field: "electors_number",
      headerName: t("common.electors.number"),
      hide: !electors_number,
      minWidth: 200,
    },
    {
      field: "driving_licence_no",
      headerName: t("common.dlno"),
      hide: !driving_licence_no,
      minWidth: 200,
    },
    {
      field: "passport_no",
      headerName: t("common.passport.no"),
      hide: !passport_no,
      minWidth: 150,
    },
  ];

  return { columns };
};
