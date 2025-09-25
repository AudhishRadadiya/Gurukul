import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { EVENT_DONATION_ENTRY_ROUTES } from "@web/constants/routes/event_donation_entry/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventDonationEntryKeys } from "@web/queryKeysFactories/eventDonationEntryKeys";
import type {
  ApiSuccessResponse,
  ApiErrorResponse,
} from "@web/types/apiResponse";
import type {
  GetExportPayload,
  GetListArgsAg2,
  FilType,
} from "@web/types/shared-types";

export type GetEventDonationEntryExportApiSuccessResponse =
  ApiSuccessResponse<GetExportPayload>;

type ExportMutationVariables = {
  body?: GetListArgsAg2;
  fileType: FilType;
};

type UseEventDonationEntryExportArgs = {
  options: UseMutationOptions<
    GetEventDonationEntryExportApiSuccessResponse,
    ApiErrorResponse<GetExportPayload>,
    ExportMutationVariables
  >;
};

export function useGetEventDonationEntryExport({
  options = {},
}: UseEventDonationEntryExportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetEventDonationEntryExportApiSuccessResponse>(
          EVENT_DONATION_ENTRY_ROUTES.export(fileType),
          body
        );

      return data;
    },
    mutationKey: eventDonationEntryKeys.export(),
    ...options,
  });
}
