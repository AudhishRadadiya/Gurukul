export const eventContactDetailKeys = {
  add: () => [...eventContactDetailKeys.all, "add"],

  all: ["event-contact-detail"],

  delete: (eventContactDetailId: string) => [
    ...eventContactDetailKeys.all,
    "delete",
    eventContactDetailId,
  ],

  edit: (eventContactDetailId: string) => [
    ...eventContactDetailKeys.all,
    "edit",
    eventContactDetailId,
  ],

  get: (eventContactDetailId: string) => [
    ...eventContactDetailKeys.all,
    "get",
    eventContactDetailId,
  ],

  listing: (body: object = {}) => [
    ...eventContactDetailKeys.all,
    "listing",
    body,
  ],

  options: () => [...eventContactDetailKeys.all, "options"],
} as const;
