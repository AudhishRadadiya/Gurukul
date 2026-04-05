export const webBannerKeys = {
  add: () => [...webBannerKeys.all, "add"] as const,

  all: ["web-banner"],

  delete: (bannerId: string) =>
    [...webBannerKeys.all, "delete", bannerId] as const,

  edit: (bannerId: string) => [...webBannerKeys.all, "edit", bannerId] as const,

  get: (bannerId: string) => [...webBannerKeys.all, "get", bannerId] as const,

  listing: (body: object = {}) =>
    [...webBannerKeys.all, "listing", body] as const,
} as const;
