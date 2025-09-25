import {
  ADDRESS_TYPE,
  CREATE,
  EDIT,
  PERMISSIONS,
  SUB_MODULES,
  VIEW,
} from "@web/constants/permission/permission";
import { SETTINGS_PATH } from "@web/constants/permission/settings/permission";

export const ADDRESS_TYPE_PERMISSION_PATH =
  `${SETTINGS_PATH}.${SUB_MODULES}.${ADDRESS_TYPE}` as const;

export const ADDRESS_TYPE_PERMISSION = {
  CREATE: `${ADDRESS_TYPE_PERMISSION_PATH}.${PERMISSIONS}.${CREATE}`,
  EDIT: `${ADDRESS_TYPE_PERMISSION_PATH}.${PERMISSIONS}.${EDIT}`,
  MENU: `${ADDRESS_TYPE_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
