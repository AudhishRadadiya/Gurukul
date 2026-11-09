import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type { UserListType } from "@web/components/user/user-master/UserMasterList/hooks/useGetUserMaster";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { CustomEnumFilter } from "@web/utils/ag-grid-custom-filter";
import { dateFormat } from "@web/utils/date";

export const useUserMasterColumns = () => {
  const { trueFalseOptions } = useGetTrueFalseOptions();

  const column: AgColumnsWithActions<UserListType> = [
    {
      field: "user_full_name",
      headerName: t("userFullName.label"),
      minWidth: 180,
    },
    {
      field: "user_login_name",
      headerName: t("common.name.label", {
        label: t("login.label"),
      }),
      minWidth: 150,
    },
    {
      field: "user_email",
      headerName: t("userEmail.label"),
      minWidth: 200,
    },
    {
      field: "user_contact_no",
      headerName: t("common.contact.label"),
      minWidth: 150,
    },
    {
      field: "user_type",
      headerName: t("userType.label"),
      minWidth: 120,
    },
    {
      field: "branch_names",
      headerName: t("branchNames.label"),
      minWidth: 200,
    },
    {
      field: "is_active",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("status.label"),
      minWidth: 80,
    },
    {
      field: "is_full_permission",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("fullPermission.label"),
      minWidth: 120,
    },
    {
      field: "closed_time",
      headerName: t("closedTime.label"),
      minWidth: 120,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "view_from",
      filter: "agDateColumnFilter",
      headerName: t("viewFrom.label"),
      minWidth: 120,
    },
    {
      field: "donation_edit",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("donationEdit.label"),
      minWidth: 120,
    },
    {
      field: "is_allow_print_export",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("printExport.label"),
      minWidth: 120,
    },
    {
      field: "user_login_otp",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("loginOtp.label"),
      minWidth: 90,
    },
    {
      field: "days",
      filter: "agNumberColumnFilter",
      headerName: t("days.label"),
      minWidth: 100,
    },
    {
      field: "receipt_name",
      headerName: t("common.receipt.label", {
        label: t("name.label"),
      }),
      minWidth: 150,
    },
  ];

  return { column };
};
