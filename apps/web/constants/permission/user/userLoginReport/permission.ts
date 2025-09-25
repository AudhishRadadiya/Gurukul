import {
  PERMISSIONS,
  SUB_MODULES,
  USER_LOGIN_REPORT,
  VIEW,
} from "@web/constants/permission/permission";
import { USER_PERMISSION_PATH } from "@web/constants/permission/user/permission";

export const USER_LOGIN_REPORT_PERMISSION_PATH =
  `${USER_PERMISSION_PATH}.${SUB_MODULES}.${USER_LOGIN_REPORT}` as const;

export const USER_LOGIN_REPORT_PERMISSION = {
  MENU: `${USER_LOGIN_REPORT_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
