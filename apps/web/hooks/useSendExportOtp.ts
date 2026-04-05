import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { ExportModule, ExportType } from "@web/constants/export";
import { EXPORT_OTP_ROUTES } from "@web/constants/routes/export-otp/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { exportOtpKeys } from "@web/queryKeysFactories/exportOtpKeys";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type SendExportOtpPayload = {
  message?: string;
};

export type SendExportOtpApiSuccessResponse =
  ApiSuccessResponse<SendExportOtpPayload>;

type SendExportOtpRequestData = {
  export_type: ExportType;
  module: ExportModule;
};

type UseSendExportOtpArgs = {
  options?: UseMutationOptions<
    SendExportOtpApiSuccessResponse,
    ApiErrorResponse<SendExportOtpPayload>,
    SendExportOtpRequestData
  >;
};

export function useSendExportOtp({ options = {} }: UseSendExportOtpArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (requestData: SendExportOtpRequestData) => {
      const { data } = await axiosPrivate.post<SendExportOtpApiSuccessResponse>(
        EXPORT_OTP_ROUTES.send,
        {
          export_type: requestData.export_type,
          module: requestData.module,
        }
      );

      return data;
    },
    mutationKey: exportOtpKeys.send(),
    ...options,
  });
}
