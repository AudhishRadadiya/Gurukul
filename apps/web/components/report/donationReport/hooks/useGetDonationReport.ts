import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { DonationReportFormFieldValues } from "@web/components/report/donationReport/DonationReportFrom";
import { DONATION_REPORT_ROUTES } from "@web/constants/routes/donation_report/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationReportKeys } from "@web/queryKeysFactories/donationReport";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type GetDonationReportResponse = {
  url: string;
};

export type GetDonationReportApiSuccessResponse =
  ApiSuccessResponse<GetDonationReportResponse>;

type UseGetDonationReportArgs = {
  options: UseMutationOptions<
    GetDonationReportApiSuccessResponse,
    ApiErrorResponse<DonationReportFormFieldValues>,
    Partial<DonationReportFormFieldValues>
  >;
};

export function useGetDonationReport({
  options = {},
}: UseGetDonationReportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<GetDonationReportApiSuccessResponse>(
          DONATION_REPORT_ROUTES.post,
          formValues
        );

      return data;
    },
    mutationKey: donationReportKeys.generate(),
    ...options,
  });
}
