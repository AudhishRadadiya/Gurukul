import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { EVENT_WISE_DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventDonationKeys } from "@web/queryKeysFactories/eventDonation";
import type {
  ApiSuccessResponse,
  ApiErrorResponse,
} from "@web/types/apiResponse";
import type {
  GetExportPayload,
  GetListArgsAg2,
  FilType,
} from "@web/types/shared-types";

export type GetEventDonationExportApiSuccessResponse =
  ApiSuccessResponse<GetExportPayload>;

type ExportMutationVariables = {
  body?: GetListArgsAg2;
  fileType: FilType;
};

type UseGetEventDonationExportArgs = {
  options: UseMutationOptions<
    GetEventDonationExportApiSuccessResponse,
    ApiErrorResponse<GetExportPayload>,
    ExportMutationVariables
  >;
};

export function useGetEventDonationExport({
  options = {},
}: UseGetEventDonationExportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetEventDonationExportApiSuccessResponse>(
          EVENT_WISE_DONATION_ROUTES.export(fileType),
          body
        );

      return data;
    },
    mutationKey: eventDonationKeys.export(),
    ...options,
  });
}

