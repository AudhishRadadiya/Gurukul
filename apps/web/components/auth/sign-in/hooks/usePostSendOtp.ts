import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { AUTH_ROUTES } from "@web/constants/routes/auth/routes";
import { authKeys } from "@web/queryKeysFactories/auth";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import { rawAxios } from "@web/utils/axios";

export type SendOtpRequestData = {
  mobile_number: string;
  user_id: string;
};

export type SendOtpVerifyData = {
  data: string;
};

export type SendOtpApiSuccessResponse = ApiSuccessResponse<SendOtpVerifyData>;

type UsePostSendOtpArgs = {
  options?: UseMutationOptions<
    SendOtpVerifyData,
    ApiErrorResponse,
    SendOtpRequestData
  >;
};

export function usePostSendOtp({ options = {} }: UsePostSendOtpArgs) {
  return useMutation({
    mutationFn: async (requestData: SendOtpRequestData) => {
      const { data } = await rawAxios.post<SendOtpApiSuccessResponse>(
        AUTH_ROUTES.sendOtp,
        requestData
      );

      return data.data;
    },
    mutationKey: authKeys.sendOtp(),
    ...options,
  });
}
