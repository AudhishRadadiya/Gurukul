import {
  DASHBOARD,
  PERMISSIONS,
  VIEW,
} from "@web/constants/permission/permission";

export const DASHBOARD_PERMISSION_PATH = `${DASHBOARD}` as const;

export const DASHBOARD_PERMISSION = {
  MENU: `${DASHBOARD_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
