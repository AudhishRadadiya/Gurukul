import { useQuery } from "@tanstack/react-query";

import { EVENT_WISE_DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventDonationKeys } from "@web/queryKeysFactories/eventDonation";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";
import { isBranchFilterEnabled } from "@web/utils/reactQuery";

export type EventDonationDropdownDetail = {
  event_dropdown_id: string;
  title: string;
  value: string;
};

export type EventItemDetail =
  | {
      amount: number;
      event_item_id: string;
      kind: "event_item";
      quantity: number;
      title: string;
      total_amount: number;
    }
  | {
      event_item_id: string;
      kind: "event_item_multi";
      title: string;
      value: number;
    };

export type EventDonation = {
  amount: number;
  bank_name: string;
  cancel_date: string;
  cheque_no: string;
  contact_no: string;
  date: string;
  donation_mode: string;
  donation_type: string;
  edit_by: string;
  email: string;
  entry_by: string;
  event: string;
  event_dropdown_detail?: EventDonationDropdownDetail[];
  event_items_detail?: EventItemDetail[];
  full_count: string;
  is_cancel: boolean;
  is_cancel_active: boolean;
  is_reminder: boolean;
  organize_remark: string;
  receipt_name: string;
  receipt_no: string;
  remark: string;
};

export function useGetEventDonation(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getEventDonation = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        donationDetail: EventDonation[];
        full_count: number;
        total_amount: string;
        total_cancel_amount: string;
        total_receipt: string;
      }>
    >(EVENT_WISE_DONATION_ROUTES.listing, body);

    return data.data;
  };

  return useQuery({
    enabled: isBranchFilterEnabled(body),
    initialData: {
      donationDetail: [],
      full_count: 0,
      total_amount: "0",
      total_cancel_amount: "0",
      total_receipt: "0",
    },
    queryFn: () => getEventDonation(body),
    queryKey: eventDonationKeys.listing(body),
  });
}
