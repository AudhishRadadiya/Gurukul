import { t } from "i18next";

import type { BusinessDetailFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/businessDetail/Dialog/BusinessDetailForm";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useBusinessDetailListColumns = () => {
  const column: AgColumnsWithActions<BusinessDetailFormFieldValues> = [
    {
      field: "business_name",
      headerName: t("common.business.name"),
    },
    {
      field: "pan",
      headerName: t("panNumber.label"),
    },
    {
      field: "email",
      headerName: t("email.label"),
    },
    {
      field: "pincode",
      headerName: t("pincode.label"),
    },
    {
      field: "city",
      headerName: t("common.city"),
    },
    {
      field: "state",
      headerName: t("state.label"),
    },
    {
      field: "address",
      headerName: t("address.label"),
    },
  ];

  return { column };
};
