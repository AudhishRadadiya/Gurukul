export const suvicharMasterKeys = {
  add: () => [...suvicharMasterKeys.all, "add"] as const,

  all: ["suvichar-master"],

  delete: (suvicharId: string) =>
    [...suvicharMasterKeys.all, "delete", suvicharId] as const,

  edit: (suvicharId: string) =>
    [...suvicharMasterKeys.all, "edit", suvicharId] as const,

  get: (suvicharId: string) =>
    [...suvicharMasterKeys.all, "get", suvicharId] as const,

  listing: (body: object = {}) =>
    [...suvicharMasterKeys.all, "listing", body] as const,
} as const;
