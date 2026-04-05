import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { BankMasterFormFieldValues } from "@web/components/settings/BankMaster/Dialogs/BankMasterForm";
import { BANK_MASTER_ROUTES } from "@web/constants/routes/bank_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { bankMasterKeys } from "@web/queryKeysFactories/bankMaster";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseAddBankMasterArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<BankMasterFormFieldValues>,
    Partial<BankMasterFormFieldValues>
  >;
};

export function useAddBankMaster({ options = {} }: UseAddBankMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        BANK_MASTER_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: bankMasterKeys.add(),
    ...options,
  });
}
