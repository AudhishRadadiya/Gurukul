import { PERMISSIONS, USER, VIEW } from "@web/constants/permission/permission";

export const USER_PERMISSION_PATH = `${USER}` as const;

export const USER_PERMISSION = {
  MENU: `${USER_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
