import {
  BANK_MASTER,
  CREATE,
  DELETE,
  EDIT,
  PERMISSIONS,
  SUB_MODULES,
  VIEW,
} from "@web/constants/permission/permission";
import { SETTINGS_PATH } from "@web/constants/permission/settings/permission";

export const BANK_MASTER_PERMISSION_PATH =
  `${SETTINGS_PATH}.${SUB_MODULES}.${BANK_MASTER}` as const;

export const BANK_MASTER_PERMISSION = {
  CREATE: `${BANK_MASTER_PERMISSION_PATH}.${PERMISSIONS}.${CREATE}`,
  DELETE: `${BANK_MASTER_PERMISSION_PATH}.${PERMISSIONS}.${DELETE}`,
  EDIT: `${BANK_MASTER_PERMISSION_PATH}.${PERMISSIONS}.${EDIT}`,
  MENU: `${BANK_MASTER_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
