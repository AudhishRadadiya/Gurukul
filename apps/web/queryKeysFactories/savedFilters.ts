export const savedFiltersKeys = {
  all: ["saved-filters"] as const,

  getSavedFilters: (moduleKey: string) =>
    [...savedFiltersKeys.all, "get", moduleKey] as const,

  saveFilters: (moduleKey: string) =>
    [...savedFiltersKeys.all, moduleKey] as const,
};
