import { useQuery } from "@tanstack/react-query";

import { EVENT_MASTER_ROUTES } from "@web/constants/routes/event_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventKeys } from "@web/queryKeysFactories/event";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type LinksType = {
  branch_name: string;
  branch_slug: string;
  link: string;
  quick_link: string;
};

export type EventMasterDetail = {
  branch_name: string;
  description: string;
  end_date: string;
  event_master_id: string;
  event_master_name: string;
  full_count: string;
  is_active: boolean;
  is_deleted: boolean;
  is_need_reminder: boolean;
  is_one_time: boolean;
  is_online: boolean;
  is_send_sms: boolean;
  links: LinksType[];
  location: string;
  start_date: string;
  trust_id: string[];
  trust_names: string;
};

export function useGetEventMaster(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getEvent = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        eventMasterDetail: EventMasterDetail[];
        totalCount: number;
      }>
    >(EVENT_MASTER_ROUTES.listing, body);

    return data.data;
  };

  return useQuery({
    initialData: { eventMasterDetail: [], totalCount: 0 },
    queryFn: () => getEvent(body),
    queryKey: eventKeys.listing(body),
  });
}
