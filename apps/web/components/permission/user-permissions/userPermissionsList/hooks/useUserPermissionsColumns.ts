import { t } from "i18next";

import type { UserPermissionList } from "@web/components/permission/user-permissions/userPermissionsList/hooks/useGetUserPermissions";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useUserPermissionsColumns = () => {
  const column: AgColumnsWithActions<UserPermissionList> = [
    {
      field: "user_full_name",
      headerName: t("userFullName.label"),
    },
    {
      field: "user_name",
      headerName: t("common.name.label", {
        label: t("login.label"),
      }),
    },
  ];

  return { column };
};
