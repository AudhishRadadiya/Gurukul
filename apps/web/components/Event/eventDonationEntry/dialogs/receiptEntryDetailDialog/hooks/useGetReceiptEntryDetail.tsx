import { useQuery } from "@tanstack/react-query";

import { EVENT_DONATION_ENTRY_ROUTES } from "@web/constants/routes/event_donation_entry/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventDonationEntryKeys } from "@web/queryKeysFactories/eventDonationEntryKeys";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type ReceiptEntryDonationDetail = {
  amount: string;
  donation_date: string;
  donation_mode: string;
  full_count: string;
  trust_name: string;
  trust_receipt_no: string;
};

export type GetReceiptEntryDetailSuccessResponse = ApiSuccessResponse<{
  eventDonations: ReceiptEntryDonationDetail[];
  totalCount: number;
}>;

export function useGetReceiptEntryDetail(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getReceiptEntryDetail = async (body: GetListArgsAg2) => {
    const { data } =
      await axiosPrivate.post<GetReceiptEntryDetailSuccessResponse>(
        EVENT_DONATION_ENTRY_ROUTES.donationReceiptListing,
        body
      );

    return data.data;
  };

  return useQuery({
    initialData: { eventDonations: [], totalCount: 0 },
    queryFn: () => getReceiptEntryDetail(body),
    queryKey: eventDonationEntryKeys.donationReceiptListing(body),
  });
}
