import {
  CREATE,
  EDIT,
  MASTER_TYPE,
  PERMISSIONS,
  SUB_MODULES,
  VIEW,
} from "@web/constants/permission/permission";
import { SETTINGS_PATH } from "@web/constants/permission/settings/permission";

export const MASTER_TYPE_PERMISSION_PATH =
  `${SETTINGS_PATH}.${SUB_MODULES}.${MASTER_TYPE}` as const;

export const MASTER_TYPE_PERMISSION = {
  CREATE: `${MASTER_TYPE_PERMISSION_PATH}.${PERMISSIONS}.${CREATE}`,
  EDIT: `${MASTER_TYPE_PERMISSION_PATH}.${PERMISSIONS}.${EDIT}`,
  MENU: `${MASTER_TYPE_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
