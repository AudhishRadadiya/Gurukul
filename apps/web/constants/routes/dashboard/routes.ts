import { API, LIST } from "@web/constants/routes/common";
import type { FilType } from "@web/types/shared-types";

export const DASHBOARD_BASE_URL = `${API}/dashboard` as const;

export const DASHBOARD_ROUTES = {
  dashboardAnniversariesExport: (fileType: FilType) =>
    `${DASHBOARD_BASE_URL}/anniversaries/${LIST}/${fileType}` as const,

  dashboardAnniversariesList:
    `${DASHBOARD_BASE_URL}/anniversaries/${LIST}` as const,

  dashboardBirthdaysExport: (fileType: FilType) =>
    `${DASHBOARD_BASE_URL}/birthdays/${LIST}/${fileType}` as const,

  dashboardBirthdaysList: `${DASHBOARD_BASE_URL}/birthdays/${LIST}` as const,

  dashboardCards: `${DASHBOARD_BASE_URL}/cards` as const,

  dashboardCharts: `${DASHBOARD_BASE_URL}/charts` as const,
} as const;
