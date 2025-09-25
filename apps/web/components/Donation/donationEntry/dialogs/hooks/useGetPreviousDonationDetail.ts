import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";

import { DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationEntryKeys } from "@web/queryKeysFactories/donationEntry";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

export type PreviousDonationDetail = {
  aadhar_no: string;
  address: string;
  address_id: string | null;
  atg: boolean;
  bank_id: string;
  branch_id: string;
  business_name: string;
  cancel_date: string | null;
  cheque_no: string;
  cheque_status: number;
  city: string;
  contact_no: string;
  date: string;
  direct_print: boolean;
  district: string | null;
  donation_id: string;
  donation_mode_id: string;
  donation_type_id: string;
  driving_licence_no: string;
  electors_number: string;
  email_id: string;
  event_reminder_date: string;
  event_reminder_note: string;
  event_type_id: string;
  first_name: string;
  is_cancel: boolean;
  is_reminder: boolean;
  last_name: string;
  middle_name: string;
  mode_of_receipt: string;
  name_of_receipt: string;
  organize_remark: string;
  pan_no: string;
  passport_no: string;
  pincode: number;
  prasad: boolean;
  print_receipt: boolean;
  receipt_no: string;
  receipt_sequence: number;
  ref_receipt_no: string;
  remarks: string;
  send_email: boolean;
  send_sms: boolean;
  state: string;
  taluko: string | null;
  trust_id: string;
};

export type GetPreviousDonationDetailSuccessResponse = ApiSuccessResponse<{
  donationDetail: PreviousDonationDetail[];
  totalCount: number;
}>;

type GetListArgsAg2 = Partial<
  IGetRowsParams & {
    contact_no: string;
    endRow: number;
    startRow: number;
  }
>;

export function useGetPreviousDonationDetail(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getPreviousDonationDetail = async (body: GetListArgsAg2) => {
    const { data } =
      await axiosPrivate.post<GetPreviousDonationDetailSuccessResponse>(
        DONATION_ROUTES.previousDonationDetail,
        body
      );

    return data.data;
  };

  return useQuery({
    enabled: !!body.contact_no,
    initialData: { donationDetail: [], totalCount: 0 },
    queryFn: () => getPreviousDonationDetail(body),
    queryKey: donationEntryKeys.previousDonationDetail(body),
  });
}
