import { useQuery } from "@tanstack/react-query";

import { USER_ROUTES } from "@web/constants/routes/user/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { userKeys } from "@web/queryKeysFactories/user";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export function useGetReportUserOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchReportUserOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      USER_ROUTES.reportUserOptions
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchReportUserOption,
    queryKey: userKeys.reportUserOptions(),
  });
}
