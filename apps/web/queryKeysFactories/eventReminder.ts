export const eventReminderKeys = {
  all: ["event-reminder"],

  export: () => [...eventReminderKeys.all, "export"] as const,

  listing: (body: object = {}) =>
    [...eventReminderKeys.all, "listing", body] as const,
} as const;
