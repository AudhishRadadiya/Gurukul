"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type {
  TwoFactorVerifyData,
  TwoFactorVerifyRequestData,
} from "@web/components/auth/sign-in/hooks/usePostVerifyGoogleAuth";
import { AUTH_ROUTES } from "@web/constants/routes/auth/routes";
import { authKeys } from "@web/queryKeysFactories/auth";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import { rawAxios } from "@web/utils/axios";

export type VerifyOtpApiSuccessResponse =
  ApiSuccessResponse<TwoFactorVerifyData>;

type UsePostVerifyOtpArgs = {
  options?: UseMutationOptions<
    TwoFactorVerifyData,
    ApiErrorResponse,
    TwoFactorVerifyRequestData
  >;
};

export function usePostVerifyOtp({ options = {} }: UsePostVerifyOtpArgs) {
  return useMutation({
    mutationFn: async (requestData: TwoFactorVerifyRequestData) => {
      const { data } = await rawAxios.post<VerifyOtpApiSuccessResponse>(
        AUTH_ROUTES.otpVerify,
        requestData
      );

      return data.data;
    },
    mutationKey: authKeys.otpVerify(),
    ...options,
  });
}
