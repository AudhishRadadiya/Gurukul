import { useQuery } from "@tanstack/react-query";

import { EVENT_DONATION_ENTRY_ROUTES } from "@web/constants/routes/event_donation_entry/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventDonationEntryKeys } from "@web/queryKeysFactories/eventDonationEntryKeys";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type DonationReceiptEntryDetail = {
  address: string;
  amount: number;
  city: string;
  date: string;
  donar_name: string;
  event_donation_id: string;
  event_master_name: string;
  full_count: string;
  hastak_name: string;
  pending_amount: number;
  received_amount: number;
  remark: string;
};

export type GetDonationReceiptEntryDetailSuccessResponse = ApiSuccessResponse<{
  eventDonations: DonationReceiptEntryDetail[];
  totalCount: number;
}>;

export function useGetDonationReceiptEntryDetail(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getDonationReceiptEntryDetail = async (body: GetListArgsAg2) => {
    const { data } =
      await axiosPrivate.post<GetDonationReceiptEntryDetailSuccessResponse>(
        EVENT_DONATION_ENTRY_ROUTES.donationReceiptEntryDetail,
        body
      );

    return data.data;
  };

  return useQuery({
    initialData: { eventDonations: [], totalCount: 0 },
    queryFn: () => getDonationReceiptEntryDetail(body),
    queryKey: eventDonationEntryKeys.donationReceiptEntryDetail(body),
  });
}
