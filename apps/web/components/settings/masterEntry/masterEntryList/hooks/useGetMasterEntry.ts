import { useQuery } from "@tanstack/react-query";

import { PARAMETER_ROUTES } from "@web/constants/routes/master_type/parameter/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { masterEntryKeys } from "@web/queryKeysFactories/masterEntry";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type MasterParameterDetails = {
  full_count: string;
  master_parameter_id: string;
  master_type: string;
  master_type_id: string;
  name: string;
};

export type GetParameterSuccessResponse = ApiSuccessResponse<{
  masterParameterDetails: MasterParameterDetails[];
  totalCount: number;
}>;

export function useGetMasterEntry(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getMasterEntry = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetParameterSuccessResponse>(
      PARAMETER_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { masterParameterDetails: [], totalCount: 0 },
    queryFn: () => getMasterEntry(body),
    queryKey: masterEntryKeys.listing(body),
  });
}
