import { t } from "i18next";

import type { BankMaster } from "@web/components/Donation/BankMaster/BankMasterList/hooks/useGetBankMaster";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useBankMasterColumns = () => {
  const column: AgColumnsWithActions<BankMaster> = [
    {
      field: "bank_name",
      headerName: t("common.name.label", {
        label: t("bank.menu.label"),
      }),
    },
    {
      field: "is_active",
      headerName: t("isActive.label"),
    },
  ];

  return { column };
};
