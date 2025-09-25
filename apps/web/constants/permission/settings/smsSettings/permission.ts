import {
  CREATE,
  EDIT,
  PERMISSIONS,
  SMS_SETTINGS,
  SUB_MODULES,
  VIEW,
} from "@web/constants/permission/permission";
import { SETTINGS_PATH } from "@web/constants/permission/settings/permission";

export const SMS_SETTINGS_PERMISSION_PATH =
  `${SETTINGS_PATH}.${SUB_MODULES}.${SMS_SETTINGS}` as const;

export const SMS_SETTINGS_PERMISSION = {
  CREATE: `${SMS_SETTINGS_PERMISSION_PATH}.${PERMISSIONS}.${CREATE}`,
  EDIT: `${SMS_SETTINGS_PERMISSION_PATH}.${PERMISSIONS}.${EDIT}`,
  MENU: `${SMS_SETTINGS_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
