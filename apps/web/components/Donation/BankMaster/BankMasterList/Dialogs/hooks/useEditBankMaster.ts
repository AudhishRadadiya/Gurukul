import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { BankMaster } from "@web/components/Donation/BankMaster/BankMasterList/hooks/useGetBankMaster";
import type { BankMasterFormFieldValues } from "@web/components/Donation/BankMaster/Dialogs/BankMasterForm";
import { BANK_MASTER_ROUTES } from "@web/constants/routes/bank_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { bankMasterKeys } from "@web/queryKeysFactories/bankMaster";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

export type EditBankMasterApiResponse = ApiSuccessResponse<BankMaster>;

type UseEditBankMasterArgs = {
  bankId: string;
  options: UseMutationOptions<
    EditBankMasterApiResponse,
    ApiErrorResponse<BankMasterFormFieldValues>,
    Partial<BankMasterFormFieldValues>
  >;
};

export function useEditBankMaster({
  bankId,
  options = {},
}: UseEditBankMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditBankMasterApiResponse>(
        BANK_MASTER_ROUTES.patch(bankId),
        formValues
      );

      return data;
    },
    mutationKey: bankMasterKeys.edit(bankId),
    ...options,
  });
}
