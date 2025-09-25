import {
  PERMISSIONS,
  REPORT,
  VIEW,
} from "@web/constants/permission/permission";

export const REPORT_PATH = `${REPORT}` as const;

export const REPORT_PERMISSION = {
  MENU: `${REPORT_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
