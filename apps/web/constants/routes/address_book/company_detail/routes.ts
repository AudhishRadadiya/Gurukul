import { ADDRESS_BOOK_BASE_URL } from "@web/constants/routes/address_book/routes";
import { LIST, OPTION } from "@web/constants/routes/common";

export const COMPANY_DETAIL_BASE_URL =
  `${ADDRESS_BOOK_BASE_URL}/company_detail` as const;

export const COMPANY_DETAIL_ROUTES = {
  listing: `${COMPANY_DETAIL_BASE_URL}/${LIST}` as const,

  options: `${COMPANY_DETAIL_BASE_URL}/${LIST}/${OPTION}` as const,
} as const;
