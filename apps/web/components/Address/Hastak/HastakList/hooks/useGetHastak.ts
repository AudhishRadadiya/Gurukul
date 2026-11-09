import { useQuery } from "@tanstack/react-query";

import { WEB_USER_HASTAK_LIST_ROUTES } from "@web/constants/routes/hastak_list/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { hastakKeys } from "@web/queryKeysFactories/hastak";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";
import { isBranchFilterEnabled } from "@web/utils/reactQuery";

export type Hastak = {
  hastak_id: string;
  hastak_mobile_no: string;
  hastak_name: string;
  is_ignored: boolean;
};

export type GetHastakSuccessResponse = ApiSuccessResponse<{
  hastakList: Hastak[];
  totalCount: number;
}>;

export function useGetHastak(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getHastak = async () => {
    const { data } = await axiosPrivate.post<GetHastakSuccessResponse>(
      WEB_USER_HASTAK_LIST_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    enabled: isBranchFilterEnabled(body),
    initialData: { hastakList: [], totalCount: 0 },
    queryFn: () => getHastak(),
    queryKey: hastakKeys.listing(body),
  });
}
