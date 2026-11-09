import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type {
  EventContactGroupApiPayload,
  EventContactGroupFormFieldValues,
} from "@web/components/Event/eventContactGroup/Dialogs/EventContactGroupForm";
import { EVENT_CONTACT_DETAIL_ROUTES } from "@web/constants/routes/event_contact_detail/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventContactDetailKeys } from "@web/queryKeysFactories/eventContactDetail";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type AddEventContactGroupApiSuccessResponse =
  ApiSuccessResponse<EventContactGroupFormFieldValues>;

type UseAddEventContactGroupArgs = {
  options: UseMutationOptions<
    AddEventContactGroupApiSuccessResponse,
    ApiErrorResponse<EventContactGroupFormFieldValues>,
    Partial<EventContactGroupApiPayload>
  >;
};

export function useAddEventContactGroup({
  options = {},
}: UseAddEventContactGroupArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddEventContactGroupApiSuccessResponse>(
          EVENT_CONTACT_DETAIL_ROUTES.post,
          formValues
        );

      return data;
    },
    mutationKey: eventContactDetailKeys.add(),
    ...options,
  });
}
