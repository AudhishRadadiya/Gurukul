import { useQuery } from "@tanstack/react-query";

import { DONATION_MASTER_ROUTES } from "@web/constants/routes/donation_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationMasterKeys } from "@web/queryKeysFactories/donationMaster";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type DonationMaster = {
  branch_id: string[];
  branch_name: string;
  donation_master_id: string;
  donation_master_name: string;
  full_count: string;
  is_active: boolean;
  is_csr: boolean;
  is_deleted: boolean;
  remark: string;
};

export type GetDonationMasterSuccessResponse = ApiSuccessResponse<{
  donationDetails: DonationMaster[];
  totalCount: number;
}>;

export function useGetDonationMaster(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getDonationMaster = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetDonationMasterSuccessResponse>(
      DONATION_MASTER_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { donationDetails: [], totalCount: 0 },
    queryFn: () => getDonationMaster(body),
    queryKey: donationMasterKeys.listing(body),
  });
}
