import { useQuery } from "@tanstack/react-query";

import { COMPANY_DETAIL_ROUTES } from "@web/constants/routes/address_book/company_detail/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { businessDetailKeys } from "@web/queryKeysFactories/businessDetail";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";
import { isBranchFilterEnabled } from "@web/utils/reactQuery";

export type BusinessDetail = {
  address: string;
  alternet_mobile_no: string;
  business_detail_id: string;
  business_name: string;
  contact_id: string;
  contact_no: string;
  email: string;
  full_count: string;
  main_name: string;
  pan: string;
};

export type GetBusinessDetailSuccessResponse = ApiSuccessResponse<{
  business_detail: BusinessDetail[];
  totalCount: number;
}>;

export function useGetBusinessDetail(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getBusinessDetailData = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetBusinessDetailSuccessResponse>(
      COMPANY_DETAIL_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    enabled: isBranchFilterEnabled(body),
    initialData: { business_detail: [], totalCount: 0 },
    queryFn: () => getBusinessDetailData(body),
    queryKey: businessDetailKeys.listing(body),
  });
}
