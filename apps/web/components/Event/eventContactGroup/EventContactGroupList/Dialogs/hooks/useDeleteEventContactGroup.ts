import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { EventContactGroup } from "@web/components/Event/eventContactGroup/EventContactGroupList/hooks/useGetEventContactGroup";
import { EVENT_CONTACT_DETAIL_ROUTES } from "@web/constants/routes/event_contact_detail/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventContactDetailKeys } from "@web/queryKeysFactories/eventContactDetail";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type DeleteEventContactGroupApiResponse = ApiSuccessResponse<EventContactGroup>;

type UseDeleteEventContactGroupArgs = {
  eventContactGroupId: string;
  options: UseMutationOptions<
    DeleteEventContactGroupApiResponse,
    ApiErrorResponse
  >;
};

export function useDeleteEventContactGroup({
  eventContactGroupId,
  options = {},
}: UseDeleteEventContactGroupArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteEventContactGroupApiResponse>(
          EVENT_CONTACT_DETAIL_ROUTES.delete(eventContactGroupId)
        );

      return data;
    },
    mutationKey: eventContactDetailKeys.delete(eventContactGroupId),
    ...options,
  });
}
