import { t } from "i18next";

import type { CurrencyData } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/dialog/hooks/useGetCurrencyDetail";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useCurrencyDetailColumns = () => {
  const column: AgColumnsWithActions<CurrencyData> = [
    {
      field: "currency",
      headerName: t("currency.detail.currency"),
    },
    {
      field: "qty",
      headerName: t("currency.detail.qty"),
    },
    {
      field: "amount",
      headerName: t("currency.detail.amount"),
    },
  ];

  return { column };
};
