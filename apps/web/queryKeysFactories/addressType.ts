export const addressTypeKeys = {
  add: () => [...addressTypeKeys.all, "add"],

  all: ["address-type"],

  edit: (addressTypeId: string) => [
    ...addressTypeKeys.all,
    "edit",
    addressTypeId,
  ],

  get: (addressTypeId: string) => [
    ...addressTypeKeys.all,
    "get",
    addressTypeId,
  ],

  listing: (body: object = {}) => [...addressTypeKeys.all, "listing", body],

  options: () => [...addressTypeKeys.all, "options"],
} as const;
