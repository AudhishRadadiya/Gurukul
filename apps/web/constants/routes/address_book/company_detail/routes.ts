import { ADDRESS_BOOK_BASE_URL } from "@web/constants/routes/address_book/routes";
import { LIST, OPTION } from "@web/constants/routes/common";
import type { FilType } from "@web/types/shared-types";

export const COMPANY_DETAIL_BASE_URL =
  `${ADDRESS_BOOK_BASE_URL}/company_detail` as const;

export const COMPANY_DETAIL_ROUTES = {
  export: (fileType: FilType) =>
    `${COMPANY_DETAIL_BASE_URL}/${LIST}/${fileType}` as const,

  listing: `${COMPANY_DETAIL_BASE_URL}/${LIST}` as const,

  options: `${COMPANY_DETAIL_BASE_URL}/${LIST}/${OPTION}` as const,
} as const;
