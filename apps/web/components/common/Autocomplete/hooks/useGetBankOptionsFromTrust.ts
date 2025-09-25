import type { OptionsType } from "@codezee/sixtify-brahma";
import { useQuery } from "@tanstack/react-query";

import { TRUST_ROUTES } from "@web/constants/routes/trust/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { trustKeys } from "@web/queryKeysFactories/trust";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type useGetBankOptionsFromTrustArgs = {
  trustId?: string;
};

export function useGetBankOptionsFromTrust({
  trustId,
}: useGetBankOptionsFromTrustArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchTrustOptions = async () => {
    const { data } = await axiosPrivate.post<ApiSuccessResponse<OptionsType[]>>(
      TRUST_ROUTES.bankOptions,
      { trust_id: trustId }
    );

    return data.data;
  };

  return useQuery({
    enabled: !!trustId,
    initialData: [],
    queryFn: fetchTrustOptions,
    queryKey: trustKeys.bankOptions(trustId),
  });
}
