import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { EventMasterApiSuccessResponse } from "@web/components/settings/event-master/AddEventMaster/hooks/useAddEventMaster";
import { EVENT_MASTER_ROUTES } from "@web/constants/routes/event_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventKeys } from "@web/queryKeysFactories/event";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type CloneEventMasterApiResponse =
  ApiSuccessResponse<EventMasterApiSuccessResponse>;

type UseCloneEventMasterArgs = {
  eventMasterId: string;
  options: UseMutationOptions<CloneEventMasterApiResponse, ApiErrorResponse>;
};

export function useCloneEventMaster({
  eventMasterId,
  options = {},
}: UseCloneEventMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.get<CloneEventMasterApiResponse>(
        EVENT_MASTER_ROUTES.clone(eventMasterId)
      );

      return data;
    },
    mutationKey: eventKeys.clone(eventMasterId),
    ...options,
  });
}
