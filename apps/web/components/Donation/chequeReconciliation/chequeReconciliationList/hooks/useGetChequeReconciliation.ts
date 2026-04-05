import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";

import type { chequeStatus } from "@web/components/common/Autocomplete/hooks/useGetChequeStatusOptions";
import { CHEQUE_RECONCILIATION_ROUTES } from "@web/constants/routes/cheque_reconciliation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { chequeReconciliationKeys } from "@web/queryKeysFactories/chequeReconciliation";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import { isBranchFilterEnabled } from "@web/utils/reactQuery";

export type ChequeReconciliation = {
  amount: number;
  bank_name: string;
  cheque_no: string;
  cheque_status: chequeStatus;
  contact_no: string;
  date: string;
  donation_id: string;
  event: string;
  full_count: string;
  pass_bank: string;
  pass_by_user: string;
  pass_date: string;
  receipt_name: string;
  receipt_no: string;
  trust: string;
  trust_id: string;
};

export type GetChequeReconciliationSuccessResponse = ApiSuccessResponse<{
  chequeReconciliationData: ChequeReconciliation[];
  totalCount: number;
}>;

type GetChequeReconciliationListArgs = Partial<
  IGetRowsParams & {
    endRow: number;
    externalFilter?: FieldValues;
    is_active: boolean;
    responseFields: string[];
    startRow: number;
  }
>;

export function useGetChequeReconciliation(
  body: GetChequeReconciliationListArgs
) {
  const { axiosPrivate } = useAxiosPrivate();

  const getChequeReconciliation = async (
    body: GetChequeReconciliationListArgs
  ) => {
    const { data } =
      await axiosPrivate.post<GetChequeReconciliationSuccessResponse>(
        CHEQUE_RECONCILIATION_ROUTES.listing,
        body
      );

    return data.data;
  };

  return useQuery({
    enabled: isBranchFilterEnabled(body),
    initialData: {
      chequeReconciliationData: [],
      totalCount: 0,
    },
    queryFn: () => getChequeReconciliation(body),
    queryKey: chequeReconciliationKeys.listing(body),
  });
}
