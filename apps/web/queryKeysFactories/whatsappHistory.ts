export const whatsappHistoryKeys = {
  all: ["whatsapp-history"],

  listing: (body: object = {}) => [...whatsappHistoryKeys.all, "listing", body],
} as const;
