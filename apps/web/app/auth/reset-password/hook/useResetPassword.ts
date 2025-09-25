"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import type { ResetPasswordPayload } from "@web/app/auth/reset-password/page";
import { AUTH_ROUTES } from "@web/constants/routes/auth/routes";
import { useAxios } from "@web/hooks/useAxios";
import { authKeys } from "@web/queryKeysFactories/auth";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type ResetPasswordApiSuccessResponse = ApiSuccessResponse<
  Record<string, string>
>;

type UseResetPasswordArgs = {
  options: UseMutationOptions<
    ResetPasswordApiSuccessResponse,
    ApiErrorResponse<ResetPasswordPayload>,
    ResetPasswordPayload
  >;
  token: string;
};

export function useResetPassword({
  options = {},
  token,
}: UseResetPasswordArgs) {
  const { axios } = useAxios();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axios.post<ResetPasswordApiSuccessResponse>(
        AUTH_ROUTES.resetPassword,
        formValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },
    mutationKey: authKeys.resetPassword(),
    ...options,
  });
}
