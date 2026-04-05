import {
  CREATE,
  EDIT,
  PERMISSIONS,
  SUB_MODULES,
  USER_PERMISSION,
  VIEW,
} from "@web/constants/permission/permission";
import { PERMISSION_PATH } from "@web/constants/permission/permissions/permissions";

export const USER_PERMISSION_PATH =
  `${PERMISSION_PATH}.${SUB_MODULES}.${USER_PERMISSION}` as const;

export const USER_PERMISSION_OF_PERMISSION = {
  CREATE: `${USER_PERMISSION_PATH}.${PERMISSIONS}.${CREATE}`,
  EDIT: `${USER_PERMISSION_PATH}.${PERMISSIONS}.${EDIT}`,
  MENU: `${USER_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
