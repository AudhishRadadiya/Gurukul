import { useQuery } from "@tanstack/react-query";

import type { DonationMaster } from "@web/components/Donation/DonationMaster/DonationMasterList/hooks/useGetDonationMaster";
import { DONATION_MASTER_ROUTES } from "@web/constants/routes/donation_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationMasterKeys } from "@web/queryKeysFactories/donationMaster";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetDonationMasterDetailsArgs = {
  donationMasterId: DonationMaster["donation_master_id"];
};

export function useGetDonationMasterDetails({
  donationMasterId,
}: UseGetDonationMasterDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDonationMasterDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<DonationMaster>>(
      DONATION_MASTER_ROUTES.get(donationMasterId)
    );

    return data;
  };

  return useQuery({
    enabled: !!donationMasterId,
    queryFn: fetchDonationMasterDetails,
    queryKey: donationMasterKeys.get(donationMasterId),
  });
}
