import { useQuery } from "@tanstack/react-query";

import { USER_PERMISSIONS_ROUTES } from "@web/constants/routes/user/permissions/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { userPermissionsKeys } from "@web/queryKeysFactories/userPermissions";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type UserPermissionList = {
  full_count: string;
  is_full_permission: boolean;
  is_have_permission: boolean;
  user_full_name: string;
  user_id: string;
  user_name: string;
};

export type GetUserPermissionSuccessResponse = ApiSuccessResponse<{
  totalCount: number;
  userPermissionList: UserPermissionList[];
}>;

export function useGetUserPermissions(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getUserPermissions = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetUserPermissionSuccessResponse>(
      USER_PERMISSIONS_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { totalCount: 0, userPermissionList: [] },
    queryFn: () => getUserPermissions(body),
    queryKey: userPermissionsKeys.listing(body),
  });
}
