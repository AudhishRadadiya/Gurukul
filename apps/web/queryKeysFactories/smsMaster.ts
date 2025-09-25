export const smsMasterKeys = {
  add: () => [...smsMasterKeys.all, "add"] as const,

  all: ["sms-master"],

  delete: (smsMasterId: string) =>
    [...smsMasterKeys.all, "delete", smsMasterId] as const,

  edit: (smsMasterId: string) =>
    [...smsMasterKeys.all, "edit", smsMasterId] as const,

  get: (smsMasterId: string) =>
    [...smsMasterKeys.all, "get", smsMasterId] as const,

  listing: (body: object = {}) =>
    [...smsMasterKeys.all, "listing", body] as const,

  options: () => [...smsMasterKeys.all, "options"] as const,
} as const;
