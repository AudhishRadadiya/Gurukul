import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { EVENT_MASTER_ROUTES } from "@web/constants/routes/event_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventKeys } from "@web/queryKeysFactories/event";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseCloneEventMasterArgs = {
  eventMasterId: string;
  options: UseMutationOptions<EmptyApiSuccessResponse, ApiErrorResponse>;
};

export function useCloneEventMaster({
  eventMasterId,
  options = {},
}: UseCloneEventMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.get<EmptyApiSuccessResponse>(
        EVENT_MASTER_ROUTES.clone(eventMasterId)
      );

      return data;
    },
    mutationKey: eventKeys.clone(eventMasterId),
    ...options,
  });
}
