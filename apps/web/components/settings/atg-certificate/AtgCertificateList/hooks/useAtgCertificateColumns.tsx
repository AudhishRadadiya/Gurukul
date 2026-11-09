import { t } from "i18next";

import type { AtgCertificate } from "@web/components/settings/atg-certificate/AtgCertificateList/hooks/useGetAtgCertificate";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useAtgCertificateColumns = () => {
  const column: AgColumnsWithActions<AtgCertificate> = [
    {
      field: "trust_name",
      headerName: t("trust.label"),
    },
    {
      field: "financial_year",
      headerName: t("financial.year.label"),
    },
  ];

  return { column };
};
