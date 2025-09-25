import { useQuery } from "@tanstack/react-query";

import { DONATION_MODE_ROUTES } from "@web/constants/routes/donation_mode/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationModeKeys } from "@web/queryKeysFactories/donationMode";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export function useGetDonationModeOfReceiptOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDonationModeOfReceiptOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      DONATION_MODE_ROUTES.modeOfReceiptOptions
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchDonationModeOfReceiptOption,
    queryKey: donationModeKeys.modeOfReceiptOptions(),
  });
}
