import { useQuery } from "@tanstack/react-query";

import { MASTER_TYPE_ROUTES } from "@web/constants/routes/master_type/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { masterTypeKeys } from "@web/queryKeysFactories/masterType";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type MasterType = {
  full_count: string;
  is_hastak: boolean;
  master_type: string;
  master_type_id: string;
};

export type GetMasterTypeSuccessResponse = ApiSuccessResponse<{
  masterParameterDetails: MasterType[];
  totalCount: number;
}>;

export function useGetMasterType(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getMasterType = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetMasterTypeSuccessResponse>(
      MASTER_TYPE_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { masterParameterDetails: [], totalCount: 0 },
    queryFn: () => getMasterType(body),
    queryKey: masterTypeKeys.listing(body),
  });
}
