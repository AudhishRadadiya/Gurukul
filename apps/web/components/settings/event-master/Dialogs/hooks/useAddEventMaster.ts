import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { EventMasterFormFieldValues } from "@web/components/settings/event-master/Dialogs/EventMasterForm";
import { EVENT_MASTER_ROUTES } from "@web/constants/routes/event_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventKeys } from "@web/queryKeysFactories/event";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type AddEventMasterApiSuccessResponse =
  ApiSuccessResponse<EventMasterFormFieldValues>;

type UseAddEventMasterArgs = {
  options: UseMutationOptions<
    AddEventMasterApiSuccessResponse,
    ApiErrorResponse<EventMasterFormFieldValues>,
    Partial<EventMasterFormFieldValues>
  >;
};

export function useAddEventMaster({ options = {} }: UseAddEventMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddEventMasterApiSuccessResponse>(
          EVENT_MASTER_ROUTES.post,
          formValues
        );

      return data;
    },
    mutationKey: eventKeys.add(),
    ...options,
  });
}
