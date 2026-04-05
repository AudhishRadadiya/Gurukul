import {
  CREATE,
  DELETE,
  EDIT,
  PERMISSIONS,
  SUB_MODULES,
  VIEW,
  WEB_BANNER,
} from "@web/constants/permission/permission";
import { SETTINGS_PATH } from "@web/constants/permission/settings/permission";

export const WEB_BANNER_PERMISSION_PATH =
  `${SETTINGS_PATH}.${SUB_MODULES}.${WEB_BANNER}` as const;

export const WEB_BANNER_PERMISSION = {
  CREATE: `${WEB_BANNER_PERMISSION_PATH}.${PERMISSIONS}.${CREATE}`,
  DELETE: `${WEB_BANNER_PERMISSION_PATH}.${PERMISSIONS}.${DELETE}`,
  EDIT: `${WEB_BANNER_PERMISSION_PATH}.${PERMISSIONS}.${EDIT}`,
  MENU: `${WEB_BANNER_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
