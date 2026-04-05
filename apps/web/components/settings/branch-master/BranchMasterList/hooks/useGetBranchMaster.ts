import { useQuery } from "@tanstack/react-query";

import { BRANCH_ROUTES } from "@web/constants/routes/branch/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { branchKeys } from "@web/queryKeysFactories/branch";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type Branch = {
  address: string;
  branch_code: string;
  branch_id: string;
  branch_name: string;
  city: string;
  contact_no: string;
  contact_person_name: string;
  full_count: string;
  gst_no: string;
  is_active: boolean;
  is_deleted: boolean;
  is_online: boolean;
  logo: string;
};

export function useGetBranchMaster(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getBranch = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        branchDetails: Branch[];
        totalCount: number;
      }>
    >(BRANCH_ROUTES.listing, body);

    return data.data;
  };

  return useQuery({
    initialData: { branchDetails: [], totalCount: 0 },
    queryFn: () => getBranch(body),
    queryKey: branchKeys.listing(body),
  });
}
