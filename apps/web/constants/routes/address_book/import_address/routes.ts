import { ADDRESS_BOOK_BASE_URL } from "@web/constants/routes/address_book/routes";

export const IMPORT_ADDRESS_BASE_URL =
  `${ADDRESS_BOOK_BASE_URL}/import/excel` as const;

export const IMPORT_ADDRESS_ROUTES = {
  post: `${IMPORT_ADDRESS_BASE_URL}` as const,
} as const;
