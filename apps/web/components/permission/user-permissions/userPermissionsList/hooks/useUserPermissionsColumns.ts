import { t } from "i18next";

import type { UserPermissionList } from "@web/components/permission/user-permissions/userPermissionsList/hooks/useGetUserPermissions";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useUserPermissionsColumns = () => {
  const column: AgColumnsWithActions<UserPermissionList> = [
    {
      field: "user_full_name",
      headerName: t("common.username"),
    },
    {
      field: "role",
      headerName: t("role.menu.label"),
    },
  ];

  return { column };
};
