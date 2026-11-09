export const hastakKeys = {
  all: ["hastak-list"],

  convert: () => [...hastakKeys.all, "convert"] as const,

  edit: () => [...hastakKeys.all, "edit"] as const,

  export: () => [...hastakKeys.all, "export"] as const,

  listing: (body: object = {}) => [...hastakKeys.all, "list", body] as const,
} as const;
