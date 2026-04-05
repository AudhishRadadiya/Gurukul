export const eventKeys = {
  add: () => [...eventKeys.all, "add"] as const,

  all: ["event"] as const,

  clone: (eventMasterId: string) =>
    [...eventKeys.all, "clone", eventMasterId] as const,

  delete: (eventMasterId: string) =>
    [...eventKeys.all, "delete", eventMasterId] as const,

  edit: (eventMasterId: string) =>
    [...eventKeys.all, "edit", eventMasterId] as const,

  eventDropdownOptions: (eventMasterId: string) =>
    [...eventKeys.all, "event-dropdown-options", eventMasterId] as const,

  filterOptions: (isUserWise?: boolean) =>
    [
      ...eventKeys.all,
      "filter-options",
      ...(isUserWise ? ["user-wise"] : []),
    ] as const,

  get: (eventMasterId: string) =>
    [...eventKeys.all, "get", eventMasterId] as const,

  listing: (body: object = {}) => [...eventKeys.all, "listing", body] as const,

  multipleFilterOptions: (branchIds: string[]) => [
    ...eventKeys.all,
    "multiple-filter-options",
    branchIds,
  ],

  multipleOptions: (branchIds: string[]) => [
    ...eventKeys.all,
    "multiple-options",
    branchIds,
  ],

  options: (isUserWise?: boolean) =>
    [
      ...eventKeys.all,
      "options",
      ...(isUserWise ? ["user-wise"] : []),
    ] as const,
} as const;
