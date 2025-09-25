import {
  CREATE,
  EDIT,
  EMAIL_SETTINGS,
  PERMISSIONS,
  SUB_MODULES,
  VIEW,
} from "@web/constants/permission/permission";
import { SETTINGS_PATH } from "@web/constants/permission/settings/permission";

export const EMAIL_SETTINGS_PERMISSION_PATH =
  `${SETTINGS_PATH}.${SUB_MODULES}.${EMAIL_SETTINGS}` as const;

export const EMAIL_SETTINGS_PERMISSION = {
  CREATE: `${EMAIL_SETTINGS_PERMISSION_PATH}.${PERMISSIONS}.${CREATE}`,
  EDIT: `${EMAIL_SETTINGS_PERMISSION_PATH}.${PERMISSIONS}.${EDIT}`,
  MENU: `${EMAIL_SETTINGS_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
