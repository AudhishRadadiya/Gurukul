import { useQuery } from "@tanstack/react-query";

import { BANK_MASTER_ROUTES } from "@web/constants/routes/bank_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { bankMasterKeys } from "@web/queryKeysFactories/bankMaster";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export function useGetBankNameOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBankNameOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      BANK_MASTER_ROUTES.nameOptions
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchBankNameOption,
    queryKey: bankMasterKeys.nameOptions(),
  });
}
