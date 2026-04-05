import { t } from "i18next";

import type { MismatchedAddressList } from "@web/components/Address/UpdateDonorAddress/UpdateDonorAddressList/hooks/useGetUpdateDonorAddress";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useUpdateDonorAddressColumns = () => {
  const column: AgColumnsWithActions<MismatchedAddressList> = [
    {
      field: "first_name",
      headerName: t("firstName.label"),
    },
    {
      field: "contact_no",
      headerName: t("contactNumber.label"),
    },
    {
      field: "donation_address",
      headerName: t("donationAddress.label"),
    },
    {
      field: "donation_city",
      headerName: t("donationCity.label"),
    },
    {
      field: "donation_pincode",
      headerName: t("donationPincode.label"),
    },
  ];

  return { column };
};
