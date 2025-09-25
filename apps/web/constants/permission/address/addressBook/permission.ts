import { ADDRESS_PERMISSION_PATH } from "@web/constants/permission/address/permission";
import {
  PERMISSIONS,
  SUB_MODULES,
  VIEW,
  ADDRESS_BOOK,
} from "@web/constants/permission/permission";

export const ADDRESS_BOOK_PERMISSION_PATH =
  `${ADDRESS_PERMISSION_PATH}.${SUB_MODULES}.${ADDRESS_BOOK}` as const;

export const ADDRESS_BOOK_PERMISSION = {
  MENU: `${ADDRESS_BOOK_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
