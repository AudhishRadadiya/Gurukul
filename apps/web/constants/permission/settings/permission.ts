import {
  PERMISSIONS,
  SETTINGS,
  VIEW,
} from "@web/constants/permission/permission";

export const SETTINGS_PATH = `${SETTINGS}` as const;

export const SETTINGS_PERMISSION = {
  MENU: `${SETTINGS_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
