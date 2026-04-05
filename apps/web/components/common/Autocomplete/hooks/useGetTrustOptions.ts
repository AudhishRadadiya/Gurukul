import { useQuery } from "@tanstack/react-query";

import { getTrustOptionsRoute } from "@web/constants/routes/trust/routes";
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

type UseGetTrustOptionsProps = {
  useShortName?: boolean;
  useUserWise?: boolean;
};

export function useGetTrustOptions(props?: UseGetTrustOptionsProps) {
  const { axiosPrivate } = useAxiosPrivate();

  const { useShortName = false, useUserWise = false } = props || {};

  const fetchTrustOption = async () => {
    const url = getTrustOptionsRoute(useShortName, useUserWise);

    const { data } =
      await axiosPrivate.get<ApiSuccessResponse<TrustOptionsData[]>>(url);

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchTrustOption,
    queryKey: trustKeys.options(useShortName, useUserWise),
  });
}
