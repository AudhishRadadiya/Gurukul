import { ADDRESS_BOOK_BASE_URL } from "@web/constants/routes/address_book/routes";
import { LIST } from "@web/constants/routes/common";

export const FAMILY_MEMBER_BASE_URL =
  `${ADDRESS_BOOK_BASE_URL}/family_member` as const;

export const FAMILY_MEMBER_ROUTES = {
  listing: `${FAMILY_MEMBER_BASE_URL}/${LIST}` as const,
} as const;
