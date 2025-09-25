import { EVENT, PERMISSIONS, VIEW } from "@web/constants/permission/permission";

export const EVENT_PERMISSION_PATH = `${EVENT}` as const;

export const EVENT_PERMISSION = {
  MENU: `${EVENT_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
