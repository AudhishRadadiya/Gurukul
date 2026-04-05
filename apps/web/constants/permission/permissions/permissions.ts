import { PERMISSIONS, VIEW } from "@web/constants/permission/permission";

export const PERMISSION_PATH = `${PERMISSIONS}` as const;

export const PERMISSIONS_OF_PERMISSION = {
  MENU: `${PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
