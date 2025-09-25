import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";

import { CHEQUE_RECONCILIATION_ROUTES } from "@web/constants/routes/cheque_reconciliation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { chequeReconciliationKeys } from "@web/queryKeysFactories/chequeReconciliation";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import type { FilType, GetExportPayload } from "@web/types/shared-types";

export type GetChequeReconciliationExportApiSuccessResponse =
  ApiSuccessResponse<GetExportPayload>;

type ExportMutationVariables = {
  body?:
    | IGetRowsParams
    | Partial<{
        externalFilter: FieldValues;
      }>;
  fileType: FilType;
};

type UseAddChequeReconciliationExportArgs = {
  options: UseMutationOptions<
    GetChequeReconciliationExportApiSuccessResponse,
    ApiErrorResponse<GetExportPayload>,
    ExportMutationVariables
  >;
};

export function useGetChequeReconciliationExport({
  options = {},
}: UseAddChequeReconciliationExportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetChequeReconciliationExportApiSuccessResponse>(
          CHEQUE_RECONCILIATION_ROUTES.export(fileType),
          body
        );

      return data;
    },
    mutationKey: chequeReconciliationKeys.export(),
    ...options,
  });
}
