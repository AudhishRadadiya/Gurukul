import { useQuery } from "@tanstack/react-query";

import type { RolesPermissionsFormFieldValues } from "@web/components/permission/RolesPermissionsForm";
import { ROLE_ROUTES } from "@web/constants/routes/role/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { roleKeys } from "@web/queryKeysFactories/role";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetRolesArgs = {
  roleId: string;
};

export function useGetRoles({ roleId }: UseGetRolesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchRoles = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<RolesPermissionsFormFieldValues>
    >(ROLE_ROUTES.get(roleId));

    return data;
  };

  const query = useQuery({
    enabled: !!roleId,
    queryFn: fetchRoles,
    queryKey: roleKeys.get(roleId),
  });

  return query;
}
