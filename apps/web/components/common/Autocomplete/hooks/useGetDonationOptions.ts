import { useQuery } from "@tanstack/react-query";

import { DONATION_MASTER_ROUTES } from "@web/constants/routes/donation_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationMasterKeys } from "@web/queryKeysFactories/donationMaster";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

type UseGetDonationOptionsProps = {
  isUserWiseAll?: boolean;
};

export function useGetDonationOptions({
  isUserWiseAll,
}: UseGetDonationOptionsProps = {}) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDonationOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      DONATION_MASTER_ROUTES.userWiseOptions(isUserWiseAll)
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchDonationOption,
    queryKey: donationMasterKeys.userWiseOptions(isUserWiseAll),
  });
}
