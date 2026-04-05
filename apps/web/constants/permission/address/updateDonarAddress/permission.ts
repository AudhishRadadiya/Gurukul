import { ADDRESS_PERMISSION_PATH } from "@web/constants/permission/address/permission";
import {
  PERMISSIONS,
  SUB_MODULES,
  UPDATE_DONAR_ADDRESS,
  VIEW,
} from "@web/constants/permission/permission";

export const UPDATE_DONAR_ADDRESS_PERMISSION_PATH =
  `${ADDRESS_PERMISSION_PATH}.${SUB_MODULES}.${UPDATE_DONAR_ADDRESS}` as const;

export const UPDATE_DONAR_ADDRESS_PERMISSION = {
  MENU: `${UPDATE_DONAR_ADDRESS_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
