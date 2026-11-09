import { ADDRESS_PERMISSION_PATH } from "@web/constants/permission/address/permission";
import {
  HASTAK_LIST,
  PERMISSIONS,
  SUB_MODULES,
  VIEW,
} from "@web/constants/permission/permission";

export const HASTAK_LIST_PERMISSION_PATH =
  `${ADDRESS_PERMISSION_PATH}.${SUB_MODULES}.${HASTAK_LIST}` as const;

export const HASTAK_LIST_PERMISSION = {
  MENU: `${HASTAK_LIST_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
