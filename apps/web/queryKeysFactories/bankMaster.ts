export const bankMasterKeys = {
  add: () => [...bankMasterKeys.all, "add"] as const,

  all: ["bank-master"],

  edit: (bankId: string) => [...bankMasterKeys.all, "edit", bankId] as const,

  get: (bankId: string) => [...bankMasterKeys.all, "get", bankId] as const,

  listing: (body: object = {}) =>
    [...bankMasterKeys.all, "listing", body] as const,

  nameOptions: () => [...bankMasterKeys.all, "nameOptions"] as const,

  options: () => [...bankMasterKeys.all, "options"] as const,
} as const;
