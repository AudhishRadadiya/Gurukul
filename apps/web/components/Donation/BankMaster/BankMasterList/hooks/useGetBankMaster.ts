import { useQuery } from "@tanstack/react-query";

import { BANK_MASTER_ROUTES } from "@web/constants/routes/bank_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { bankMasterKeys } from "@web/queryKeysFactories/bankMaster";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type BankMaster = {
  bank_id: string;
  bank_name: string;
  branch_name: string;
  full_count: string;
  is_active: boolean;
};

export type GetBankMasterSuccessResponse = ApiSuccessResponse<{
  bankDetails: BankMaster[];
  totalCount: number;
}>;

export function useGetBankMaster(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getBankMaster = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetBankMasterSuccessResponse>(
      BANK_MASTER_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { bankDetails: [], totalCount: 0 },
    queryFn: () => getBankMaster(body),
    queryKey: bankMasterKeys.listing(body),
  });
}
