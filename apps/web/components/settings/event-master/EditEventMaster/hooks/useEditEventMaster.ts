import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { EventMasterFormFieldValues } from "@web/components/settings/event-master/AddEventMaster/EventMasterForm";
import type { EventMasterDetail } from "@web/components/settings/event-master/EventMasterList/hooks/useGetEventMaster";
import { EVENT_MASTER_ROUTES } from "@web/constants/routes/event_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventKeys } from "@web/queryKeysFactories/event";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type EditEventMasterApiResponse = ApiSuccessResponse<EventMasterDetail>;

type UseEditEventMasterArgs = {
  eventMasterId: string;
  options: UseMutationOptions<
    EditEventMasterApiResponse,
    ApiErrorResponse<EventMasterFormFieldValues>,
    Partial<EventMasterFormFieldValues>
  >;
};

export function useEditEventMaster({
  eventMasterId,
  options = {},
}: UseEditEventMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditEventMasterApiResponse>(
        EVENT_MASTER_ROUTES.patch(eventMasterId),
        formValues
      );

      return data;
    },
    mutationKey: eventKeys.edit(eventMasterId),
    ...options,
  });
}
