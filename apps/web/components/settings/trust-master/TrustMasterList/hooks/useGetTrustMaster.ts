import { useQuery } from "@tanstack/react-query";

import { TRUST_ROUTES } from "@web/constants/routes/trust/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { trustKeys } from "@web/queryKeysFactories/trust";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type Trust = {
  address: string;
  address_limit: number;
  branch_names: string;
  cash_limit: number;
  cheque_limit: number;
  contact_no: string;
  date_lock: boolean;
  default_trust: boolean;
  donation_collection_sms_no: string;
  full_count: string;
  is_active: boolean;
  pan_number: string;
  registration_no: string;
  short_name: string;
  sms_limit: number;
  tax_adj_number: string;
  trust_id: string;
  trust_name: string;
};

export function useGetTrustMaster(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getTrust = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        full_count: number;
        trustDetails: Trust[];
      }>
    >(TRUST_ROUTES.listing, body);

    return data.data;
  };

  return useQuery({
    initialData: { full_count: 0, trustDetails: [] },
    queryFn: () => getTrust(body),
    queryKey: trustKeys.listing(body),
  });
}
