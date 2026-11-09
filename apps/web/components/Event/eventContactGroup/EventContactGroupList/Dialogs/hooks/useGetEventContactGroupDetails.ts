import { useQuery } from "@tanstack/react-query";

import type { ContactDetailItemFormValues } from "@web/components/Event/eventContactGroup/EventContactDetailFields/hooks/useContactDetailImport";
import type { EventContactGroup } from "@web/components/Event/eventContactGroup/EventContactGroupList/hooks/useGetEventContactGroup";
import { EVENT_CONTACT_DETAIL_ROUTES } from "@web/constants/routes/event_contact_detail/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventContactDetailKeys } from "@web/queryKeysFactories/eventContactDetail";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type EventContactGroupDetails = {
  contact_detail: ContactDetailItemFormValues[];
  event_contact_detail_id: string;
  group_name: string;
};

type UseGetEventContactGroupDetailsArgs = {
  eventContactGroupId: EventContactGroup["event_contact_detail_id"];
};

type EventContactGroupApiSuccessResponse =
  ApiSuccessResponse<EventContactGroupDetails>;

export function useGetEventContactGroupDetails({
  eventContactGroupId,
}: UseGetEventContactGroupDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEventContactGroupDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<EventContactGroupApiSuccessResponse>(
      EVENT_CONTACT_DETAIL_ROUTES.get(eventContactGroupId)
    );

    return data;
  };

  return useQuery({
    enabled: !!eventContactGroupId,
    queryFn: fetchEventContactGroupDetails,
    queryKey: eventContactDetailKeys.get(eventContactGroupId),
  });
}
