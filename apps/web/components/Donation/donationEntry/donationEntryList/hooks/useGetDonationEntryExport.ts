import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationEntryKeys } from "@web/queryKeysFactories/donationEntry";
import type {
  ApiSuccessResponse,
  ApiErrorResponse,
} from "@web/types/apiResponse";
import type {
  GetExportPayload,
  GetListArgsAg2,
  FilType,
} from "@web/types/shared-types";

export type GetDonationEntryExportApiSuccessResponse =
  ApiSuccessResponse<GetExportPayload>;

type ExportMutationVariables = {
  body?: GetListArgsAg2;
  fileType: FilType;
};

type UseAddDonationEntryExportArgs = {
  options: UseMutationOptions<
    GetDonationEntryExportApiSuccessResponse,
    ApiErrorResponse<GetExportPayload>,
    ExportMutationVariables
  >;
};

export function useGetDonationEntryExport({
  options = {},
}: UseAddDonationEntryExportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetDonationEntryExportApiSuccessResponse>(
          DONATION_ROUTES.export(fileType),
          body
        );

      return data;
    },
    mutationKey: donationEntryKeys.export(),
    ...options,
  });
}
