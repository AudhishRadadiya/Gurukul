import { t } from "i18next";

import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type { WebUserListType } from "@web/components/user/web-user-master/WebUserMasterList/hooks/useGetWebUserMaster";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { CustomEnumFilter } from "@web/utils/ag-grid-custom-filter";

export const useWebUserMasterColumns = () => {
  const { trueFalseOptions } = useGetTrueFalseOptions();

  const column: AgColumnsWithActions<WebUserListType> = [
    { field: "your_name", headerName: t("yourName.label"), minWidth: 150 },
    { field: "father_name", headerName: t("fatherName.label"), minWidth: 150 },
    { field: "sur_name", headerName: t("surname.label"), minWidth: 140 },
    { field: "email", headerName: t("email.label"), minWidth: 200 },
    {
      field: "mobile_no",
      headerName: t("mobileNo.label"),
      minWidth: 150,
    },
    {
      field: "otp",
      headerName: t("common.enter.otp.label"),
      minWidth: 100,
    },
    {
      field: "hastak_name",
      headerName: t("hastak.name.label"),
      minWidth: 150,
    },
    {
      field: "hastak_mobile_no",
      headerName: t("hastak.mobileNumber.label"),
      minWidth: 140,
    },
    {
      field: "is_active",
      filter: CustomEnumFilter,
      filterParams: { filterOptions: trueFalseOptions, source: "server" },
      headerName: t("isActive.label"),
      minWidth: 100,
    },
  ];

  return { column };
};
