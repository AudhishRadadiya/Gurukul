import { useQuery } from "@tanstack/react-query";
import _every from "lodash/every";

import { EVENT_MASTER_ROUTES } from "@web/constants/routes/event_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventKeys } from "@web/queryKeysFactories/event";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

type UseGetFilterEventOptionsFromMultipleBranchArgs = {
  branchIds: string[];
  for_dropdown?: boolean;
};

export function useGetFilterEventOptionsFromMultipleBranch({
  branchIds,
  for_dropdown = false,
}: UseGetFilterEventOptionsFromMultipleBranchArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEventOptions = async () => {
    const { data } = await axiosPrivate.post<ApiSuccessResponse<OptionsType[]>>(
      EVENT_MASTER_ROUTES.multipleFilterOptions,
      { branch_id: branchIds, for_dropdown }
    );

    return data.data;
  };

  return useQuery({
    enabled: _every(branchIds, Boolean),
    initialData: [],
    queryFn: fetchEventOptions,
    queryKey: [...eventKeys.multipleFilterOptions(branchIds), for_dropdown],
  });
}
