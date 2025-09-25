import { useQuery } from "@tanstack/react-query";

import { DONATION_MASTER_ROUTES } from "@web/constants/routes/donation_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationMasterKeys } from "@web/queryKeysFactories/donationMaster";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export function useGetDonationOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDonationOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      DONATION_MASTER_ROUTES.options
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchDonationOption,
    queryKey: donationMasterKeys.options(),
  });
}
