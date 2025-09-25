import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";

import { DONATION_SUMMARY_ROUTES } from "@web/constants/routes/donation_summary/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationSummaryKeys } from "@web/queryKeysFactories/donationSummary";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import type { FilType, GetExportPayload } from "@web/types/shared-types";

export type GetDonationSummaryExportApiSuccessResponse =
  ApiSuccessResponse<GetExportPayload>;

type ExportMutationVariables = {
  body?:
    | IGetRowsParams
    | Partial<{
        externalFilter: FieldValues;
      }>;
  fileType: FilType;
};

type UseAddDonationSummaryExportArgs = {
  options: UseMutationOptions<
    GetDonationSummaryExportApiSuccessResponse,
    ApiErrorResponse<GetExportPayload>,
    ExportMutationVariables
  >;
};

export function useGetDonationSummaryExport({
  options = {},
}: UseAddDonationSummaryExportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetDonationSummaryExportApiSuccessResponse>(
          DONATION_SUMMARY_ROUTES.export(fileType),
          body
        );

      return data;
    },
    mutationKey: donationSummaryKeys.export(),
    ...options,
  });
}
