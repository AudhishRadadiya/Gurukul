import { useQuery } from "@tanstack/react-query";

import type { ContactDetailItemFormValues } from "@web/components/Event/eventContactGroup/EventContactDetailFields/hooks/useContactDetailImport";
import { EVENT_CONTACT_DETAIL_ROUTES } from "@web/constants/routes/event_contact_detail/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventContactDetailKeys } from "@web/queryKeysFactories/eventContactDetail";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type EventContactGroup = {
  contact_detail: ContactDetailItemFormValues[];
  event_contact_detail_id: string;
  full_count: string;
  group_name: string;
  is_deleted: boolean;
};

type EventContactGroupListApiSuccessResponse = ApiSuccessResponse<{
  contactDetails: EventContactGroup[];
  totalCount: number;
}>;

export function useGetEventContactGroup(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getEventContactGroup = async (body: GetListArgsAg2) => {
    const { data } =
      await axiosPrivate.post<EventContactGroupListApiSuccessResponse>(
        EVENT_CONTACT_DETAIL_ROUTES.listing,
        body
      );

    return data.data;
  };

  return useQuery({
    initialData: { contactDetails: [], totalCount: 0 },
    queryFn: () => getEventContactGroup(body),
    queryKey: eventContactDetailKeys.listing(body),
  });
}
