import {
  DONATION,
  PERMISSIONS,
  VIEW,
} from "@web/constants/permission/permission";

export const DONATION_PERMISSION_PATH = `${DONATION}` as const;

export const DONATION_PERMISSION = {
  MENU: `${DONATION_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
