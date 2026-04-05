import { useQuery } from "@tanstack/react-query";

import { TRUST_ROUTES } from "@web/constants/routes/trust/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { trustKeys } from "@web/queryKeysFactories/trust";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UserWiseTrustOptionsData = {
  address_limit: number;
  cash_limit: number;
  cheque_limit: number;
  label: string;
  short_name: string;
  value: string;
};

export function useGetUserWiseTrustOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchUserWiseTrustOption = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<UserWiseTrustOptionsData[]>
    >(TRUST_ROUTES.optionsUserWise);

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchUserWiseTrustOption,
    queryKey: trustKeys.userWiseTrust(),
  });
}
