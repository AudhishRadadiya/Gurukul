export const financialYearKeys = {
  add: () => [...financialYearKeys.all, "add"],

  all: ["financial-year"],

  delete: (financialYearId: string) => [
    ...financialYearKeys.all,
    "delete",
    financialYearId,
  ],

  edit: (financialYearId: string) => [
    ...financialYearKeys.all,
    "edit",
    financialYearId,
  ],

  get: (financialYearId: string) => [
    ...financialYearKeys.all,
    "get",
    financialYearId,
  ],

  listing: (body: object = {}) => [...financialYearKeys.all, "listing", body],

  options: () => [...financialYearKeys.all, "options"],
} as const;
