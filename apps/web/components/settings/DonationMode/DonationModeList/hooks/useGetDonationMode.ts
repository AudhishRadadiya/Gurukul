import { useQuery } from "@tanstack/react-query";

import { DONATION_MODE_ROUTES } from "@web/constants/routes/donation_mode/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationModeKeys } from "@web/queryKeysFactories/donationMode";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type DonationMode = {
  branch_id: string[];
  branch_name: string;
  donation_mode_code: string;
  donation_mode_id: string;
  donation_mode_name: string;
  donation_mode_receipt: string;
  full_count: string;
  is_active: boolean;
  is_bank: boolean;
};

export type GetDonationModeSuccessResponse = ApiSuccessResponse<{
  donationModeDetail: DonationMode[];
  totalCount: number;
}>;

export function useGetDonationMode(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getDonationMode = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetDonationModeSuccessResponse>(
      DONATION_MODE_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { donationModeDetail: [], totalCount: 0 },
    queryFn: () => getDonationMode(body),
    queryKey: donationModeKeys.listing(body),
  });
}
