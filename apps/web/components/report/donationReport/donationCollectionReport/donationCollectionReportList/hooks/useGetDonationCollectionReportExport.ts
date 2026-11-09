import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { DONATION_COLLECTION_REPORT_ROUTES } from "@web/constants/routes/donation_collection_report/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationCollectionKeys } from "@web/queryKeysFactories/donationCollectionKeys";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import type { FilType, GetListArgsAg2 } from "@web/types/shared-types";

type GetDonationCollectionReportExportResponse = {
  url: string;
};

export type GetDonationCollectionReportExportApiSuccessResponse =
  ApiSuccessResponse<GetDonationCollectionReportExportResponse>;

type ExportMutationVariables = {
  body?: GetListArgsAg2;
  fileType: FilType;
};

type UseGetDonationCollectionReportExportArgs = {
  options: UseMutationOptions<
    GetDonationCollectionReportExportApiSuccessResponse,
    ApiErrorResponse<GetDonationCollectionReportExportResponse>,
    ExportMutationVariables
  >;
};

export function useGetDonationCollectionReportExport({
  options = {},
}: UseGetDonationCollectionReportExportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetDonationCollectionReportExportApiSuccessResponse>(
          DONATION_COLLECTION_REPORT_ROUTES.export(fileType),
          body
        );

      return data;
    },
    mutationKey: donationCollectionKeys.export(),
    ...options,
  });
}
