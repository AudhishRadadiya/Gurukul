import { useQuery } from "@tanstack/react-query";

import { EVENT_DONATION_ENTRY_ROUTES } from "@web/constants/routes/event_donation_entry/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventDonationEntryKeys } from "@web/queryKeysFactories/eventDonationEntryKeys";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";
import { isBranchFilterEnabled } from "@web/utils/reactQuery";

export type EventDonationEntry = {
  address: string;
  amount: number;
  branch_id: string;
  city: string;
  date: string;
  donar_contact_no: string;
  donar_id: string;
  donar_name: string;
  event_donation_id: string;
  event_id: string;
  event_master_name: string;
  full_count: string;
  hastak_contact_no: string;
  hastak_id: string;
  hastak_name: string;
  note: string;
  pending_amount: number;
  received_amount: number;
  remark: string;
};

export type GetEventDonationEntrySuccessResponse = ApiSuccessResponse<{
  eventDonations: EventDonationEntry[];
  totalCount: number;
}>;

export function useGetEventDonationEntry(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getEventDonationEntry = async (body: GetListArgsAg2) => {
    const { data } =
      await axiosPrivate.post<GetEventDonationEntrySuccessResponse>(
        EVENT_DONATION_ENTRY_ROUTES.listing,
        body
      );

    return data.data;
  };

  return useQuery({
    enabled: isBranchFilterEnabled(body),
    initialData: { eventDonations: [], totalCount: 0 },
    queryFn: () => getEventDonationEntry(body),
    queryKey: eventDonationEntryKeys.listing(body),
  });
}
