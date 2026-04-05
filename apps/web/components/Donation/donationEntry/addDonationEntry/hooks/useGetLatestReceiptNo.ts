import { useQuery } from "@tanstack/react-query";

import { DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationEntryKeys } from "@web/queryKeysFactories/donationEntry";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type LatestReceiptNo = {
  ref_receipt_no: string;
};

export function useGetLatestReceiptNo() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLatestReceiptNo = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<LatestReceiptNo>>(
      DONATION_ROUTES.getLatestReceiptNo
    );

    return data;
  };

  return useQuery({
    queryFn: fetchLatestReceiptNo,
    queryKey: donationEntryKeys.latestReceiptNo(),
  });
}
