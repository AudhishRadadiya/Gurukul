import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type {
  EventContactGroupApiPayload,
  EventContactGroupFormFieldValues,
} from "@web/components/Event/eventContactGroup/Dialogs/EventContactGroupForm";
import type { EventContactGroup } from "@web/components/Event/eventContactGroup/EventContactGroupList/hooks/useGetEventContactGroup";
import { EVENT_CONTACT_DETAIL_ROUTES } from "@web/constants/routes/event_contact_detail/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventContactDetailKeys } from "@web/queryKeysFactories/eventContactDetail";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type EditEventContactGroupApiResponse = ApiSuccessResponse<EventContactGroup>;

type UseEditEventContactGroupArgs = {
  eventContactGroupId: string;
  options: UseMutationOptions<
    EditEventContactGroupApiResponse,
    ApiErrorResponse<EventContactGroupFormFieldValues>,
    Partial<EventContactGroupApiPayload>
  >;
};

export function useEditEventContactGroup({
  eventContactGroupId,
  options = {},
}: UseEditEventContactGroupArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditEventContactGroupApiResponse>(
          EVENT_CONTACT_DETAIL_ROUTES.patch(eventContactGroupId),
          formValues
        );

      return data;
    },
    mutationKey: eventContactDetailKeys.edit(eventContactGroupId),
    ...options,
  });
}
