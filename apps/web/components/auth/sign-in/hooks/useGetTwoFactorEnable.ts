"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { AUTH_ROUTES } from "@web/constants/routes/auth/routes";
import { authKeys } from "@web/queryKeysFactories/auth";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import { rawAxios } from "@web/utils/axios";

export type TwoFactorEnableData = {
  qr_code: string;
};

export type TwoFactorEnableApiSuccessResponse =
  ApiSuccessResponse<TwoFactorEnableData>;

type UsePostTwoFactorEnableArgs = {
  options?: UseMutationOptions<
    TwoFactorEnableData,
    ApiErrorResponse,
    string // user_id parameter
  >;
};

export function usePostTwoFactorEnable({
  options = {},
}: UsePostTwoFactorEnableArgs) {
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await rawAxios.get<TwoFactorEnableApiSuccessResponse>(
        `${AUTH_ROUTES.twoFactorEnable(userId)}`
      );

      return data.data;
    },
    mutationKey: authKeys.twoFactorEnable(),
    ...options,
  });
}
