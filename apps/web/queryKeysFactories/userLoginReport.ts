export const userLoginReportKeys = {
  all: ["user-login-report"],

  listing: (body: object = {}) => [...userLoginReportKeys.all, "listing", body],
} as const;
