import {
  DONATION_REPORT,
  PERMISSIONS,
  SUB_MODULES,
  VIEW,
} from "@web/constants/permission/permission";
import { REPORT_PATH } from "@web/constants/permission/report/permission";

export const DONATION_REPORT_PERMISSION_PATH =
  `${REPORT_PATH}.${SUB_MODULES}.${DONATION_REPORT}` as const;

export const DONATION_REPORT_PERMISSION = {
  MENU: `${DONATION_REPORT_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
