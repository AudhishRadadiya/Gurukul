import { useQuery } from "@tanstack/react-query";

import type { RolesPermissionsFormFieldValues } from "@web/components/permission/RolesPermissionsForm";
import { USER_PERMISSIONS_ROUTES } from "@web/constants/routes/user/permissions/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { userPermissionsKeys } from "@web/queryKeysFactories/userPermissions";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetUserPermissionsArgs = {
  userId: string;
};

export function useGetUserPermissionsData({
  userId,
}: UseGetUserPermissionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchUserPermissions = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<RolesPermissionsFormFieldValues>
    >(USER_PERMISSIONS_ROUTES.get(userId));

    return data;
  };

  const query = useQuery({
    enabled: !!userId,
    queryFn: fetchUserPermissions,
    queryKey: userPermissionsKeys.get(userId),
  });

  return query;
}
