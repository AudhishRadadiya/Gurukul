import { useQuery } from "@tanstack/react-query";

import { USER_ROUTES } from "@web/constants/routes/user/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { userKeys } from "@web/queryKeysFactories/user";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseCheckVeoArgs = {
  enabled?: boolean;
  userId?: string;
};

export function useCheckVeo({ enabled = false, userId }: UseCheckVeoArgs = {}) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchCheckVeo = async () => {
    const body = userId ? { user_id: userId } : {};

    const {
      data: { data },
    } = await axiosPrivate.post<ApiSuccessResponse<boolean>>(
      USER_ROUTES.checkDemo,
      body
    );

    return data;
  };

  return useQuery({
    enabled,
    queryFn: fetchCheckVeo,
    queryKey: userKeys.checkVeo(userId),
  });
}
