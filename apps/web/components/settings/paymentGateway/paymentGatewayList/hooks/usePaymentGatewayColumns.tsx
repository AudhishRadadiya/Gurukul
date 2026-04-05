import { t } from "i18next";

import type { PaymentGatewayDetail } from "@web/components/settings/paymentGateway/paymentGatewayList/hooks/useGetPaymentGateway";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const usePaymentGatewayColumns = () => {
  const column: AgColumnsWithActions<PaymentGatewayDetail> = [
    {
      field: "gateway_name",
      headerName: t("common.name.label", {
        label: t("gateway.label"),
      }),
    },
    {
      field: "is_test_mode",
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
