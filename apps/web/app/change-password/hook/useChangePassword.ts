import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { ChangePasswordFormFieldValues } from "@web/app/change-password/page";
import { RESET_PASSWORD_ROUTES } from "@web/constants/routes/auth/reset_password/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { resetPasswordKeys } from "@web/queryKeysFactories/resetPassword";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseChangePasswordArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<ChangePasswordFormFieldValues>,
    Partial<ChangePasswordFormFieldValues>
  >;
  userId: string;
};

export function useChangePassword({
  options = {},
  userId,
}: UseChangePasswordArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        RESET_PASSWORD_ROUTES.post(userId),
        formValues
      );

      return data;
    },
    mutationKey: resetPasswordKeys.post(userId),
    ...options,
  });
}
