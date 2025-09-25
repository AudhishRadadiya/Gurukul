import { useQuery } from "@tanstack/react-query";

import type { BankMaster } from "@web/components/Donation/BankMaster/BankMasterList/hooks/useGetBankMaster";
import { BANK_MASTER_ROUTES } from "@web/constants/routes/bank_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { bankMasterKeys } from "@web/queryKeysFactories/bankMaster";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetBankMasterDetailsArgs = {
  bankId: BankMaster["bank_id"];
};

export function useGetBankMasterDetails({
  bankId,
}: UseGetBankMasterDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBankMasterDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<BankMaster>>(
      BANK_MASTER_ROUTES.get(bankId)
    );

    return data;
  };

  return useQuery({
    enabled: !!bankId,
    queryFn: fetchBankMasterDetails,
    queryKey: bankMasterKeys.get(bankId),
  });
}
