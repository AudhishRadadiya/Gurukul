import { useQuery } from "@tanstack/react-query";

import type { PermissionsFieldValues } from "@web/components/permission/RolesPermissionsForm";
import { AUTH_ROUTES } from "@web/constants/routes/auth/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { authKeys } from "@web/queryKeysFactories/auth";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type SubModule = {
  modules: PermissionsFieldValues;
  sub_modules: Record<string, SubModule>;
};

export type UserAccessData = {
  modules: Record<string, SubModule>;
};

type UseGetUserAccessControlArgs = {
  enabled: boolean;
};

export function useGetUserAccessControl({
  enabled = true,
}: UseGetUserAccessControlArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchPermissionModules = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<UserAccessData>>(
      AUTH_ROUTES.getUserAccess()
    );

    return data;
  };

  return useQuery({
    enabled,
    queryFn: fetchPermissionModules,
    queryKey: authKeys.getUserAccess(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
