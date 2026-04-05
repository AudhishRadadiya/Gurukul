import { API, DYNAMIC, LIST, OPTION } from "@web/constants/routes/common";
import type { FilType } from "@web/types/shared-types";

export const ADDRESS_BOOK_BASE_URL = `${API}/address_book` as const;

export const ADDRESS_BOOK_ROUTES = {
  autoGno: `${ADDRESS_BOOK_BASE_URL}/auto-gno` as const,

  columnsDefault: `${ADDRESS_BOOK_BASE_URL}/columns/default` as const,

  export: (fileType: FilType) =>
    `${ADDRESS_BOOK_BASE_URL}/${LIST}/${fileType}` as const,

  get: (addressBookId: string) =>
    `${ADDRESS_BOOK_BASE_URL}/${addressBookId}` as const,

  listing: `${ADDRESS_BOOK_BASE_URL}/${LIST}` as const,

  options: `${ADDRESS_BOOK_BASE_URL}/${LIST}/${OPTION}` as const,

  patch: (addressBookId: string) =>
    `${ADDRESS_BOOK_BASE_URL}/${addressBookId}` as const,

  post: `${ADDRESS_BOOK_BASE_URL}` as const,

  printAddress: `${ADDRESS_BOOK_BASE_URL}/contact_address_pdf` as const,

  printAddressBook: `${ADDRESS_BOOK_BASE_URL}/pdf_format` as const,

  userData: `${ADDRESS_BOOK_BASE_URL}/${LIST}/${DYNAMIC}` as const,
} as const;
