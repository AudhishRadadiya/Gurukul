import { useQuery } from "@tanstack/react-query";

import { DONATION_COLLECTION_REPORT_ROUTES } from "@web/constants/routes/donation_collection_report/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationCollectionKeys } from "@web/queryKeysFactories/donationCollectionKeys";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type DailyDonationReportData = {
  amount: string;
  daily_donation_id: string;
  date: string;
  full_count: number;
  user_name: string;
};

export type GetDailyDonationReportSuccessResponse = ApiSuccessResponse<{
  dailyDonationReportList: DailyDonationReportData[];
  totalCount: number;
}>;

export function useGetDonationCollectionReport(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getDonationCollectionData = async (body: GetListArgsAg2) => {
    const { data } =
      await axiosPrivate.post<GetDailyDonationReportSuccessResponse>(
        DONATION_COLLECTION_REPORT_ROUTES.listing,
        body
      );

    return data.data;
  };

  return useQuery({
    initialData: {
      dailyDonationReportList: [],
      totalCount: 0,
    },
    queryFn: () => getDonationCollectionData(body),
    queryKey: donationCollectionKeys.listing(body),
  });
}
