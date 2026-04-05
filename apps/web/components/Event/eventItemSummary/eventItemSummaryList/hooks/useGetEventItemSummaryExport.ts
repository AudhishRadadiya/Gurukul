import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { EVENT_ITEMS_SUMMARY_ROUTES } from "@web/constants/routes/event_master/event_items/summary/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventItemSummaryKeys } from "@web/queryKeysFactories/eventSummary";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import type {
  FilType,
  GetExportPayload,
  GetListArgsAg2,
} from "@web/types/shared-types";

export type GetEventItemSummaryExportApiSuccessResponse =
  ApiSuccessResponse<GetExportPayload>;

type ExportMutationVariables = {
  body?: GetListArgsAg2;
  fileType: FilType;
};

type UseGetEventItemSummaryExportArgs = {
  options?: UseMutationOptions<
    GetEventItemSummaryExportApiSuccessResponse,
    ApiErrorResponse<GetExportPayload>,
    ExportMutationVariables
  >;
};

export function useGetEventItemSummaryExport({
  options = {},
}: UseGetEventItemSummaryExportArgs = {}) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetEventItemSummaryExportApiSuccessResponse>(
          EVENT_ITEMS_SUMMARY_ROUTES.export(fileType),
          body
        );

      return data;
    },
    mutationKey: eventItemSummaryKeys.export(),
    ...options,
  });
}
