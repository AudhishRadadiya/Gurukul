export const donationImportKeys = {
  all: ["donation-import"],

  import: () => [...donationImportKeys.all, "import"] as const,
} as const;
