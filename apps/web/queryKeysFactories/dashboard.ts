export const dashboardKeys = {
  all: ["dashboard"],

  dashboardAnniversariesExport: () =>
    [...dashboardKeys.all, "dashboardAnniversariesExport"] as const,

  dashboardAnniversariesList: (body: object = {}) =>
    [...dashboardKeys.all, "dashboardAnniversariesList", body] as const,

  dashboardBirthdaysExport: () =>
    [...dashboardKeys.all, "dashboardBirthdaysExport"] as const,

  dashboardBirthdaysList: (body: object = {}) =>
    [...dashboardKeys.all, "dashboardBirthdaysList", body] as const,

  dashboardCards: (body: object = {}) =>
    [...dashboardKeys.all, "dashboardCards", body] as const,

  dashboardCharts: (body: object = {}) =>
    [...dashboardKeys.all, "dashboardCharts", body] as const,
} as const;
