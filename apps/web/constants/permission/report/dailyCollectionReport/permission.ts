import {
  DAILY_COLLECTION_REPORT,
  PERMISSIONS,
  SUB_MODULES,
  VIEW,
} from "@web/constants/permission/permission";
import { REPORT_PATH } from "@web/constants/permission/report/permission";

export const DAILY_COLLECTION_REPORT_PERMISSION_PATH =
  `${REPORT_PATH}.${SUB_MODULES}.${DAILY_COLLECTION_REPORT}` as const;

export const DAILY_COLLECTION_REPORT_PERMISSION = {
  MENU: `${DAILY_COLLECTION_REPORT_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
