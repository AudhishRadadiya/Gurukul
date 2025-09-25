import { useQuery } from "@tanstack/react-query";

import { DONATION_COLLECTION_REPORT_ROUTES } from "@web/constants/routes/donation_collection_report/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationCollectionKeys } from "@web/queryKeysFactories/donationCollectionKeys";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

export type CurrencyData = {
  amount: number;
  currency: number;
  qty: number;
};

export type CurrencyDetail = {
  data: CurrencyData[];
  total_amount: number;
  total_qty: number;
};

type UseGetCurrencyDetailArgs = {
  dailyDonationId: string;
};

export function useGetCurrencyDetail({
  dailyDonationId,
}: UseGetCurrencyDetailArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSuvicharMasterDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<CurrencyDetail>>(
      DONATION_COLLECTION_REPORT_ROUTES.getCurrencyDetail(dailyDonationId)
    );

    return data;
  };

  return useQuery({
    enabled: !!dailyDonationId,
    initialData: { data: [], total_amount: 0, total_qty: 0 },
    queryFn: fetchSuvicharMasterDetails,
    queryKey: donationCollectionKeys.getCurrencyDetail(dailyDonationId),
  });
}
