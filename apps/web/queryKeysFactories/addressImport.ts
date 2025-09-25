export const addressImportKeys = {
  all: ["address-import"],

  import: () => [...addressImportKeys.all, "import"] as const,
} as const;
