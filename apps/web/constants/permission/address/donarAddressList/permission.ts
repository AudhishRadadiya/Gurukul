import { ADDRESS_PERMISSION_PATH } from "@web/constants/permission/address/permission";
import {
  PERMISSIONS,
  SUB_MODULES,
  VIEW,
  DONAR_ADDRESS_LIST,
} from "@web/constants/permission/permission";

export const DONAR_ADDRESS_LIST_PERMISSION_PATH =
  `${ADDRESS_PERMISSION_PATH}.${SUB_MODULES}.${DONAR_ADDRESS_LIST}` as const;

export const DONAR_ADDRESS_LIST_PERMISSION = {
  MENU: `${DONAR_ADDRESS_LIST_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
