import { useQuery } from "@tanstack/react-query";

import { BRANCH_ROUTES } from "@web/constants/routes/branch/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { branchKeys } from "@web/queryKeysFactories/branch";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { StringValueOptionsType } from "@web/types/options";

type UseGetBranchOptionsProps = {
  isUserWise?: boolean;
};

export function useGetBranchOptions({
  isUserWise = false,
}: UseGetBranchOptionsProps = {}) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBranchOption = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<StringValueOptionsType[]>
    >(BRANCH_ROUTES.options(isUserWise));

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchBranchOption,
    queryKey: branchKeys.options(isUserWise),
  });
}
