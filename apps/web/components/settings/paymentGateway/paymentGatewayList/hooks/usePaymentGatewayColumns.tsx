import { t } from "i18next";

import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type { PaymentGatewayDetail } from "@web/components/settings/paymentGateway/paymentGatewayList/hooks/useGetPaymentGateway";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { CustomEnumFilter } from "@web/utils/ag-grid-custom-filter";

export const usePaymentGatewayColumns = () => {
  const { trueFalseOptions } = useGetTrueFalseOptions();

  const column: AgColumnsWithActions<PaymentGatewayDetail> = [
    {
      field: "gateway_name",
      headerName: t("common.name.label", {
        label: t("gateway.label"),
      }),
    },
    {
      field: "is_test_mode",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("is.test.mode.label"),
    },
    {
      field: "branch_name",
      headerName: t("branch.name.label"),
    },
    {
      field: "trust_name",
      headerName: t("trust.name.label"),
    },
    {
      field: "notes",
      headerName: t("common.note"),
    },
  ];

  return { column };
};
