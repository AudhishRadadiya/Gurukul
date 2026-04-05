import {
  CREATE,
  DONATION_MODE,
  EDIT,
  PERMISSIONS,
  SUB_MODULES,
  VIEW,
} from "@web/constants/permission/permission";
import { SETTINGS_PATH } from "@web/constants/permission/settings/permission";

export const DONATION_MODE_PERMISSION_PATH =
  `${SETTINGS_PATH}.${SUB_MODULES}.${DONATION_MODE}` as const;

export const DONATION_MODE_PERMISSION = {
  CREATE: `${DONATION_MODE_PERMISSION_PATH}.${PERMISSIONS}.${CREATE}`,
  EDIT: `${DONATION_MODE_PERMISSION_PATH}.${PERMISSIONS}.${EDIT}`,
  MENU: `${DONATION_MODE_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
