import {
  PERMISSIONS,
  SUB_MODULES,
  VIEW,
  WHATSAPP_HISTORY,
} from "@web/constants/permission/permission";
import { REPORT_PATH } from "@web/constants/permission/report/permission";

export const WHATSAPP_HISTORY_PERMISSION_PATH =
  `${REPORT_PATH}.${SUB_MODULES}.${WHATSAPP_HISTORY}` as const;

export const WHATSAPP_HISTORY_PERMISSION = {
  MENU: `${WHATSAPP_HISTORY_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
