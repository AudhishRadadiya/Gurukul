import { useQuery } from "@tanstack/react-query";

import type { DonationMode } from "@web/components/settings/DonationMode/DonationModeList/hooks/useGetDonationMode";
import { DONATION_MODE_ROUTES } from "@web/constants/routes/donation_mode/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationModeKeys } from "@web/queryKeysFactories/donationMode";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetDonationModeDetailsArgs = {
  donationModeId: DonationMode["donation_mode_id"];
};

export function useGetDonationModeDetails({
  donationModeId,
}: UseGetDonationModeDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDonationModeDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<DonationMode>>(
      DONATION_MODE_ROUTES.get(donationModeId)
    );

    return data;
  };

  return useQuery({
    enabled: !!donationModeId,
    queryFn: fetchDonationModeDetails,
    queryKey: donationModeKeys.get(donationModeId),
  });
}
