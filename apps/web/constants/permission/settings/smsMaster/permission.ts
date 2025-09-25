import {
  CREATE,
  DELETE,
  EDIT,
  PERMISSIONS,
  SMS_MASTER,
  SUB_MODULES,
  VIEW,
} from "@web/constants/permission/permission";
import { SETTINGS_PATH } from "@web/constants/permission/settings/permission";

export const SMS_MASTER_PERMISSION_PATH =
  `${SETTINGS_PATH}.${SUB_MODULES}.${SMS_MASTER}` as const;

export const SMS_MASTER_PERMISSION = {
  CREATE: `${SMS_MASTER_PERMISSION_PATH}.${PERMISSIONS}.${CREATE}`,
  DELETE: `${SMS_MASTER_PERMISSION_PATH}.${PERMISSIONS}.${DELETE}`,
  EDIT: `${SMS_MASTER_PERMISSION_PATH}.${PERMISSIONS}.${EDIT}`,
  MENU: `${SMS_MASTER_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
