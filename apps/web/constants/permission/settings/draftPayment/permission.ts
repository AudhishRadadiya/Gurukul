import {
  DRAFT_PAYMENT,
  PERMISSIONS,
  SUB_MODULES,
  VIEW,
} from "@web/constants/permission/permission";
import { SETTINGS_PATH } from "@web/constants/permission/settings/permission";

export const DRAFT_PAYMENT_PERMISSION_PATH =
  `${SETTINGS_PATH}.${SUB_MODULES}.${DRAFT_PAYMENT}` as const;

export const DRAFT_PAYMENT_PERMISSION = {
  MENU: `${DRAFT_PAYMENT_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
