import { API, LIST } from "@web/constants/routes/common";
import type { FilType } from "@web/types/shared-types";

export const ADDRESS_MISMATCH_BASE_URL =
  `${API}/address_book/address-mismatch` as const;

export const ADDRESS_MISMATCH_ROUTES = {
  export: (fileType: FilType) =>
    `${ADDRESS_MISMATCH_BASE_URL}/${LIST}/${fileType}` as const,

  listing: `${ADDRESS_MISMATCH_BASE_URL}/${LIST}` as const,
  update: `${ADDRESS_MISMATCH_BASE_URL}/update` as const,
} as const;
