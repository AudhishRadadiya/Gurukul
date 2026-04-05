import { t } from "i18next";

import type { WebBannerDetail } from "@web/components/web-banner/WebBannerList/hooks/useGetWebBanner";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useWebBannerColumns = () => {
  const column: AgColumnsWithActions<WebBannerDetail> = [
    {
      field: "event_names",
      headerName: t("common.event.label"),
    },
    {
      field: "identity_name",
      headerName: t("identity.name.label"),
    },
    {
      field: "is_active",
      headerName: t("isActive.label"),
    },
    {
      field: "is_home",
      headerName: t("isHome.label"),
    },
  ];

  return { column };
};
