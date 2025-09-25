import { useQuery } from "@tanstack/react-query";

import type { ChequeReconciliation } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/hooks/useGetChequeReconciliation";
import { CHEQUE_RECONCILIATION_ROUTES } from "@web/constants/routes/cheque_reconciliation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { chequeReconciliationKeys } from "@web/queryKeysFactories/chequeReconciliation";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetChequeReconciliationDetailsArgs = {
  donationId: ChequeReconciliation["donation_id"];
};

export function useGetChequeReconciliationDetails({
  donationId,
}: UseGetChequeReconciliationDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchChequeReconciliationDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<ChequeReconciliation>>(
      CHEQUE_RECONCILIATION_ROUTES.get(donationId)
    );

    return data;
  };

  return useQuery({
    enabled: !!donationId,
    queryFn: fetchChequeReconciliationDetails,
    queryKey: chequeReconciliationKeys.get(donationId),
  });
}
