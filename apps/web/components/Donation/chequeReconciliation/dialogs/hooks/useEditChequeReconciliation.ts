import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { ChequeReconciliation } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/hooks/useGetChequeReconciliation";
import type { ChequeReconciliationFormFieldValues } from "@web/components/Donation/chequeReconciliation/dialogs/ChequeReconciliationForm";
import { CHEQUE_RECONCILIATION_ROUTES } from "@web/constants/routes/cheque_reconciliation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { chequeReconciliationKeys } from "@web/queryKeysFactories/chequeReconciliation";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type EdiChequeReconciliationApiResponse =
  ApiSuccessResponse<ChequeReconciliation>;

type UseEdiChequeReconciliationArgs = {
  donationId: string;
  options: UseMutationOptions<
    EdiChequeReconciliationApiResponse,
    ApiErrorResponse<ChequeReconciliationFormFieldValues>,
    Partial<ChequeReconciliationFormFieldValues>
  >;
};

export function useEditChequeReconciliation({
  donationId,
  options = {},
}: UseEdiChequeReconciliationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EdiChequeReconciliationApiResponse>(
          CHEQUE_RECONCILIATION_ROUTES.patch(donationId),
          formValues
        );

      return data;
    },
    mutationKey: chequeReconciliationKeys.edit(donationId),
    ...options,
  });
}
