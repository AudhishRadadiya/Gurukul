import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { EVENT_SUMMARY_ROUTES } from "@web/constants/routes/event_summary/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventSummaryKeys } from "@web/queryKeysFactories/eventSummary";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import type { FilType, GetListArgsAg2 } from "@web/types/shared-types";

type GetEventSummaryExportPayload = {
  url: string;
};

export type GetEventSummaryExportApiSuccessResponse =
  ApiSuccessResponse<GetEventSummaryExportPayload>;

type ExportMutationVariables = {
  body?: GetListArgsAg2;
  fileType: FilType;
};

type UseAddEventSummaryExportArgs = {
  options: UseMutationOptions<
    GetEventSummaryExportApiSuccessResponse,
    ApiErrorResponse<GetEventSummaryExportPayload>,
    ExportMutationVariables
  >;
};

export function useGetEventSummaryExport({
  options = {},
}: UseAddEventSummaryExportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetEventSummaryExportApiSuccessResponse>(
          EVENT_SUMMARY_ROUTES.export(fileType),
          body
        );

      return data;
    },
    mutationKey: eventSummaryKeys.export(),
    ...options,
  });
}
