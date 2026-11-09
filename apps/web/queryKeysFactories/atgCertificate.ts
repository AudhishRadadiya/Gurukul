export const atgCertificateKeys = {
  add: () => [...atgCertificateKeys.all, "add"],

  all: ["atg-certificate"],

  delete: (certificateId: string) => [
    ...atgCertificateKeys.all,
    "delete",
    certificateId,
  ],

  edit: (certificateId: string) => [
    ...atgCertificateKeys.all,
    "edit",
    certificateId,
  ],

  get: (certificateId: string) => [
    ...atgCertificateKeys.all,
    "get",
    certificateId,
  ],

  listing: (body: object = {}) => [...atgCertificateKeys.all, "listing", body],
} as const;
