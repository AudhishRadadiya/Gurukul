import {
  ADDRESS,
  PERMISSIONS,
  VIEW,
} from "@web/constants/permission/permission";

export const ADDRESS_PERMISSION_PATH = `${ADDRESS}` as const;

export const ADDRESS_PERMISSION = {
  MENU: `${ADDRESS_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
