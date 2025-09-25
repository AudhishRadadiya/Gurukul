import { useQuery } from "@tanstack/react-query";

import { DONATION_SUMMARY_ROUTES } from "@web/constants/routes/donation_summary/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationSummaryKeys } from "@web/queryKeysFactories/donationSummary";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type DonationSummary = {
  address: string;
  amount: number;
  city: string;
  contact_no: string;
  donation_id: string;
  email_id: string;
  first_name: string;
  full_count: string;
  last_name: string;
  middle_name: string;
  pan_no: string;
  receipts_count: number;
};

export type GetDonationSummarySuccessResponse = ApiSuccessResponse<{
  donationSummary: DonationSummary[];
  totalCount: number;
}>;

export function useGetDonationSummary(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getDonationSummary = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetDonationSummarySuccessResponse>(
      DONATION_SUMMARY_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { donationSummary: [], totalCount: 0 },
    queryFn: () => getDonationSummary(body),
    queryKey: donationSummaryKeys.listing(body),
  });
}
