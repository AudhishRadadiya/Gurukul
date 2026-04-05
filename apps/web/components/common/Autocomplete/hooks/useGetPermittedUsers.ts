import { useQuery } from "@tanstack/react-query";

import { USER_ROUTES } from "@web/constants/routes/user/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { userKeys } from "@web/queryKeysFactories/user";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export function useGetPermittedUsers() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchPermittedUserOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      USER_ROUTES.permittedUserOptions
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchPermittedUserOption,
    queryKey: userKeys.permittedUserOptions(),
  });
}
