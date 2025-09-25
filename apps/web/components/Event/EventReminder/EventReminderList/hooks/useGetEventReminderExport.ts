import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { EVENT_REMINDER_ROUTES } from "@web/constants/routes/event_reminder/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventReminderKeys } from "@web/queryKeysFactories/eventReminder";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import type {
  FilType,
  GetExportPayload,
  GetListArgsAg2,
} from "@web/types/shared-types";

export type GetEventReminderExportApiSuccessResponse =
  ApiSuccessResponse<GetExportPayload>;

type ExportMutationVariables = {
  body?: GetListArgsAg2;
  fileType: FilType;
};

type UseAddEventReminderExportArgs = {
  options: UseMutationOptions<
    GetEventReminderExportApiSuccessResponse,
    ApiErrorResponse<GetExportPayload>,
    ExportMutationVariables
  >;
};

export function useGetEventReminderExport({
  options = {},
}: UseAddEventReminderExportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetEventReminderExportApiSuccessResponse>(
          EVENT_REMINDER_ROUTES.export(fileType),
          body
        );

      return data;
    },
    mutationKey: eventReminderKeys.export(),
    ...options,
  });
}
