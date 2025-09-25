import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { EVENT_MASTER_ROUTES } from "@web/constants/routes/event_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventKeys } from "@web/queryKeysFactories/event";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type DeleteEventMasterApiResponse = ApiSuccessResponse<Event>;

type UseDeleteEventMasterArgs = {
  eventMasterId: string;
  options: UseMutationOptions<DeleteEventMasterApiResponse, ApiErrorResponse>;
};

export function useDeleteEventMaster({
  eventMasterId,
  options = {},
}: UseDeleteEventMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteEventMasterApiResponse>(
        EVENT_MASTER_ROUTES.delete(eventMasterId)
      );

      return data;
    },
    mutationKey: eventKeys.delete(eventMasterId),
    ...options,
  });
}
