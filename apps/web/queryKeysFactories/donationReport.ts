export const donationReportKeys = {
  all: ["donation-report"],

  generate: () => [...donationReportKeys.all, "generate"] as const,
} as const;
