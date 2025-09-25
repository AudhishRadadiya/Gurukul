import { useQuery } from "@tanstack/react-query";

import { USER_ROUTES } from "@web/constants/routes/user/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { userKeys } from "@web/queryKeysFactories/user";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export function useGetUserOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchUserOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      USER_ROUTES.options
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchUserOption,
    queryKey: userKeys.options(),
  });
}
