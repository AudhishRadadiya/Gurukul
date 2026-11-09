import { useQuery } from "@tanstack/react-query";

import { DONATION_MODE_ROUTES } from "@web/constants/routes/donation_mode/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationModeKeys } from "@web/queryKeysFactories/donationMode";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

export type DonationModeOptionsType = {
  is_bank: boolean;
  label: string;
  value: string;
};

type UseGetDonationModeOptionsProps = {
  isUserWiseAll?: boolean;
};

export function useGetDonationModeOptions({
  isUserWiseAll,
}: UseGetDonationModeOptionsProps = {}) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDonationModeOption = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<DonationModeOptionsType[]>
    >(DONATION_MODE_ROUTES.userWiseOptions(isUserWiseAll));

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchDonationModeOption,
    queryKey: donationModeKeys.userWiseOptions(isUserWiseAll),
  });
}
