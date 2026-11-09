import { t } from "i18next";

import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type { Trust } from "@web/components/settings/trust-master/TrustMasterList/hooks/useGetTrustMaster";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { CustomEnumFilter } from "@web/utils/ag-grid-custom-filter";

export const useTrustMasterColumns = () => {
  const { trueFalseOptions } = useGetTrueFalseOptions();

  const column: AgColumnsWithActions<Trust> = [
    {
      field: "trust_name",
      headerName: t("common.name.label", {
        label: t("trust.label"),
      }),
      minWidth: 200,
    },
    {
      field: "short_name",
      headerName: t("shortName.label"),
      minWidth: 200,
    },
    {
      field: "branch_names",
      headerName: t("branch.names.label"),
      minWidth: 200,
    },
    {
      field: "address",
      headerName: t("address.label"),
      minWidth: 200,
    },
    {
      field: "registration_no",
      headerName: t("registrationNo.label"),
      minWidth: 200,
    },
    {
      field: "tax_adj_number",
      headerName: t("taxAdjustNumber.label"),
      minWidth: 200,
    },
    {
      field: "pan_number",
      headerName: t("panNumber.label"),
      minWidth: 200,
    },
    {
      field: "contact_no",
      headerName: t("common.contact.label"),
      minWidth: 200,
    },
    {
      field: "cash_limit",
      filter: "agNumberColumnFilter",
      headerName: t("cashLimit.label"),
      minWidth: 200,
    },
    {
      field: "cheque_limit",
      filter: "agNumberColumnFilter",
      headerName: t("chequeLimit.label"),
      minWidth: 200,
    },
    {
      field: "date_lock",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("dateLock.label"),
      minWidth: 100,
    },
    {
      field: "is_active",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("isActive.label"),
    },
    {
      field: "address_limit",
      filter: "agNumberColumnFilter",
      headerName: t("addressLimit.label"),
      minWidth: 200,
    },
    {
      field: "donation_collection_sms_no",
      headerName: t("donarSMSNo.label"),
      minWidth: 200,
    },
    {
      field: "default_trust",
      headerName: t("defaultTrust.label"),
      minWidth: 110,
    },
    {
      field: "sms_limit",
      filter: "agNumberColumnFilter",
      headerName: t("smsLimit.label"),
      minWidth: 200,
    },
  ];

  return { column };
};
