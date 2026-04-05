import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { EVENT_DROPDOWN_SUMMARY_ROUTES } from "@web/constants/routes/event_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventDropdownSummaryKeys } from "@web/queryKeysFactories/eventDropdownSummary";
import type {
  ApiSuccessResponse,
  ApiErrorResponse,
} from "@web/types/apiResponse";
import type {
  GetExportPayload,
  GetListArgsAg2,
  FilType,
} from "@web/types/shared-types";

export type GetEventDropdownSummaryExportApiSuccessResponse =
  ApiSuccessResponse<GetExportPayload>;

type ExportMutationVariables = {
  body?: GetListArgsAg2;
  fileType: FilType;
};

type UseGetEventDropdownSummaryExportArgs = {
  options: UseMutationOptions<
    GetEventDropdownSummaryExportApiSuccessResponse,
    ApiErrorResponse<GetExportPayload>,
    ExportMutationVariables
  >;
};

export function useGetEventDropdownSummaryExport({
  options = {},
}: UseGetEventDropdownSummaryExportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetEventDropdownSummaryExportApiSuccessResponse>(
          EVENT_DROPDOWN_SUMMARY_ROUTES.export(fileType),
          body
        );

      return data;
    },
    mutationKey: eventDropdownSummaryKeys.export(),
    ...options,
  });
}

