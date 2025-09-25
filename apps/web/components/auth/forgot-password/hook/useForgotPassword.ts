"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import type { FormValuesTypes } from "@web/components/auth/forgot-password/ForgotPasswordForm";
import { AUTH_ROUTES } from "@web/constants/routes/auth/routes";
import { useAxios } from "@web/hooks/useAxios";
import { authKeys } from "@web/queryKeysFactories/auth";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type ForgotPasswordApiSuccessResponse = ApiSuccessResponse<
  Record<string, string>
>;

type UseForgotPasswordArgs = {
  options: UseMutationOptions<
    ForgotPasswordApiSuccessResponse,
    ApiErrorResponse<FormValuesTypes>,
    FormValuesTypes
  >;
};

export function useForgotPassword({ options = {} }: UseForgotPasswordArgs) {
  const { axios } = useAxios();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axios.post<ForgotPasswordApiSuccessResponse>(
        AUTH_ROUTES.forgetPassword,
        formValues
      );

      return data;
    },
    mutationKey: authKeys.forgetPassword(),
    ...options,
  });
}
