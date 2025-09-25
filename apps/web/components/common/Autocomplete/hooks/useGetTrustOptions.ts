import { useQuery } from "@tanstack/react-query";

import { TRUST_ROUTES } from "@web/constants/routes/trust/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { trustKeys } from "@web/queryKeysFactories/trust";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type TrustOptionsData = {
  address_limit: number;
  cash_limit: number;
  cheque_limit: number;
  label: string;
  short_name: string;
  value: string;
};

export function useGetTrustOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchTrustOption = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<TrustOptionsData[]>
    >(TRUST_ROUTES.options);

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchTrustOption,
    queryKey: trustKeys.options(),
  });
}
