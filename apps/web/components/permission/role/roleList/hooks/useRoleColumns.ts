import { t } from "i18next";

import type { RoleDetails } from "@web/components/permission/role/roleList/hooks/useGetRole";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useRoleColumns = () => {
  const column: AgColumnsWithActions<RoleDetails> = [
    {
      field: "role_name",
      headerName: t("role.menu.label"),
    },
  ];

  return { column };
};
