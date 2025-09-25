import { useQuery } from "@tanstack/react-query";

import type { SubModule } from "@web/components/permission/RolesPermissionsForm";
import { USER_PERMISSIONS_ROUTES } from "@web/constants/routes/user/permissions/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { userPermissionsKeys } from "@web/queryKeysFactories/userPermissions";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type PermissionModulesResponse = {
  modules: SubModule[];
};

export function useGetPermissionModules() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchPermissionModules = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<PermissionModulesResponse>>(
      USER_PERMISSIONS_ROUTES.getPermissionModules
    );

    return data.modules;
  };

  return useQuery({
    queryFn: fetchPermissionModules,
    queryKey: userPermissionsKeys.getPermissionModules(),
  });
}
