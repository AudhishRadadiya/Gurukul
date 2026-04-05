import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { AUTH_ROUTES } from "@web/constants/routes/auth/routes";
import { authKeys } from "@web/queryKeysFactories/auth";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import { rawAxios } from "@web/utils/axios";

export type TwoFactorVerifyRequestData = {
  code: string;
  user_id: string;
};

export type TwoFactorVerifyData = {
  user: {
    expired_at: string;
    login_name: string;
    token: string;
    user_id: string;
  };
};

export type TwoFactorVerifyApiSuccessResponse =
  ApiSuccessResponse<TwoFactorVerifyData>;

type UsePostVerifyGoogleAuthArgs = {
  options?: UseMutationOptions<
    TwoFactorVerifyData,
    ApiErrorResponse,
    TwoFactorVerifyRequestData
  >;
};

export function usePostVerifyGoogleAuth({
  options = {},
}: UsePostVerifyGoogleAuthArgs) {
  return useMutation({
    mutationFn: async (requestData: TwoFactorVerifyRequestData) => {
      const { data } = await rawAxios.post<TwoFactorVerifyApiSuccessResponse>(
        AUTH_ROUTES.twoFactorVerify,
        requestData
      );

      return data.data;
    },
    mutationKey: authKeys.twoFactorVerify(),
    ...options,
  });
}
