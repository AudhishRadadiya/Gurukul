import { t } from "i18next";

import type { CsrCertificate } from "@web/components/settings/csr-certificate/CsrCertificateList/hooks/useGetCsrCertificate";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useCsrCertificateColumns = () => {
  const column: AgColumnsWithActions<CsrCertificate> = [
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
