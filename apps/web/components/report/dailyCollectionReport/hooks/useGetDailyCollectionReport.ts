import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { DailyCollectionReportFromFieldValues } from "@web/components/report/dailyCollectionReport/DailyCollectionReportFrom";
import { DAILY_COLLECTION_ROUTES } from "@web/constants/routes/daily_collection/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { dailyCollectionKeys } from "@web/queryKeysFactories/dailyCollectionKeys";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type GetDailyCollectionReportResponse = {
  url: string;
};

export type GetDailyCollectionReportApiSuccessResponse =
  ApiSuccessResponse<GetDailyCollectionReportResponse>;

export type ReportMode = "report" | "report_name" | "account";

type DailyCollectionMutationVariables = {
  body: Partial<DailyCollectionReportFromFieldValues>;
  reportMode: ReportMode;
};

type UseGetDailyCollectionReportArgs = {
  options: UseMutationOptions<
    GetDailyCollectionReportApiSuccessResponse,
    ApiErrorResponse<DailyCollectionReportFromFieldValues>,
    DailyCollectionMutationVariables
  >;
};

export function useGetDailyCollectionReport({
  options = {},
}: UseGetDailyCollectionReportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({
      body,
      reportMode,
    }: DailyCollectionMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetDailyCollectionReportApiSuccessResponse>(
          DAILY_COLLECTION_ROUTES.generate(reportMode),
          body
        );

      return data;
    },
    mutationKey: dailyCollectionKeys.generate(),
    ...options,
  });
}
