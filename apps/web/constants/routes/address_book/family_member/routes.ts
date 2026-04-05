import { ADDRESS_BOOK_BASE_URL } from "@web/constants/routes/address_book/routes";
import { LIST } from "@web/constants/routes/common";
import type { FilType } from "@web/types/shared-types";

export const FAMILY_MEMBER_BASE_URL =
  `${ADDRESS_BOOK_BASE_URL}/family_member` as const;

export const FAMILY_MEMBER_ROUTES = {
  export: (fileType: FilType) =>
    `${FAMILY_MEMBER_BASE_URL}/${LIST}/${fileType}` as const,

  listing: `${FAMILY_MEMBER_BASE_URL}/${LIST}` as const,
} as const;
