import { useQuery } from "@tanstack/react-query";

import { ROLE_ROUTES } from "@web/constants/routes/role/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { roleKeys } from "@web/queryKeysFactories/role";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type RoleDetails = {
  full_count: string;
  role_id: string;
  role_name: string;
};

export type GetRoleSuccessResponse = ApiSuccessResponse<{
  roleDetails: RoleDetails[];
  totalCount: number;
}>;

export function useGetRole(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getRole = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetRoleSuccessResponse>(
      ROLE_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { roleDetails: [], totalCount: 0 },
    queryFn: () => getRole(body),
    queryKey: roleKeys.listing(body),
  });
}
