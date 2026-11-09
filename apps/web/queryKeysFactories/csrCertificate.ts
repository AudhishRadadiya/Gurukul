export const csrCertificateKeys = {
  add: () => [...csrCertificateKeys.all, "add"],
  all: ["csr-certificate"],
  delete: (certificateId: string) => [
    ...csrCertificateKeys.all,
    "delete",
    certificateId,
  ],
  edit: (certificateId: string) => [
    ...csrCertificateKeys.all,
    "edit",
    certificateId,
  ],
  get: (certificateId: string) => [
    ...csrCertificateKeys.all,
    "get",
    certificateId,
  ],
  listing: (body: object = {}) => [...csrCertificateKeys.all, "listing", body],
} as const;
