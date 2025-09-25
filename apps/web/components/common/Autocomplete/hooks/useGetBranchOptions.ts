import { useQuery } from "@tanstack/react-query";

import { BRANCH_ROUTES } from "@web/constants/routes/branch/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { branchKeys } from "@web/queryKeysFactories/branch";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export function useGetBranchOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBranchOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      BRANCH_ROUTES.options
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchBranchOption,
    queryKey: branchKeys.options(),
  });
}
