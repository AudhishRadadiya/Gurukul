import { t } from "i18next";

import type { BusinessDetail } from "@web/components/Address/address-book/BusinessDetail/BusinessDetailList/hooks/useGetBusinessDetail";
import type { BusinessDetailColumnHideTypes } from "@web/components/Address/address-book/template/dialogs/hooks/templateTypes";
import type { AgColumnsWithActions } from "@web/types/agGrid";

type UseGetBusinessDetailColumnsArgs = {
  columnHide: BusinessDetailColumnHideTypes;
};

export const useGetBusinessDetailColumns = ({
  columnHide,
}: UseGetBusinessDetailColumnsArgs) => {
  const {
    address,
    alternet_mobile_no,
    business_name,
    contact_no,
    email,
    main_name,
    pan,
  } = columnHide || {};

  const columns: AgColumnsWithActions<BusinessDetail> = [
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
      field: "main_name",
      headerName: t("common.main.member"),
      hide: !main_name,
    },
    {
      field: "business_name",
      headerName: t("common.business.name"),
      hide: !business_name,
    },
    {
      field: "address",
      headerName: t("common.address"),
      hide: !address,
    },
    {
      field: "pan",
      headerName: t("panNumber.label"),
      hide: !pan,
    },
    {
      field: "email",
      headerName: t("email.label"),
      hide: !email,
    },
  ];

  return { columns };
};
