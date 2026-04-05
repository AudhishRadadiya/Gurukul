import { useQuery } from "@tanstack/react-query";

import { DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationEntryKeys } from "@web/queryKeysFactories/donationEntry";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";
import { isBranchFilterEnabled } from "@web/utils/reactQuery";

export type DonationEntry = {
  aadhar_no: string;
  address: string;
  amount: number;
  atg: boolean;
  bank_name: string;
  cancel_date: string;
  cheque_no: string;
  city: string;
  contact_no: string;
  contribution_id: string;
  date: string;
  district: string;
  dl_no: string;
  donation_id: string;
  donation_mode: string;
  donation_type: string;
  edit_by: string;
  edit_date: string;
  elector_number: string;
  email: string;
  entry_by: string;
  entry_date: string;
  event: string;
  first_name: string;
  full_count: string;
  is_cancel: boolean;
  is_cancel_active: boolean;
  is_reminder: boolean;
  middle_name: string;
  mode_of_receipt: string;
  organize_remark: string;
  pan_no: string;
  passport_no: string;
  prasad: boolean;
  receipt_name: string;
  receipt_no: string;
  receipt_sequence: number;
  ref_receipt_no: string;
  remark: string;
  reminder_date: string;
  reminder_note: string;
  state: string;
  surname: string;
  taluko: string;
  trust_id: string;
  trust_name: string;
  zip_code: number;
};

export function useGetDonationEntry(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getDonationEntry = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        donationDetail: DonationEntry[];
        full_count: number;
        total_amount: string;
        total_cancel_amount: string;
        total_receipt: string;
      }>
    >(DONATION_ROUTES.listing, body);

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
    queryFn: () => getDonationEntry(body),
    queryKey: donationEntryKeys.listing(body),
  });
}
