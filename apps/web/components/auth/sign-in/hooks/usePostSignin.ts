import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { LoginFormFieldValues } from "@web/components/auth/sign-in/hooks/authSchema";
import { AUTH_ROUTES } from "@web/constants/routes/auth/routes";
import { authKeys } from "@web/queryKeysFactories/auth";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import { rawAxios } from "@web/utils/axios";

export type LoginUser = {
  expired_at: string;
  login_name: string;
  password: string;
  token: string;
  user_id: string;
  user_type?: string;
};

export type LoginResponse = {
  is_google_auth?: boolean;
  is_google_auth_generate?: boolean;
  is_otp?: boolean;
  user: LoginUser;
};

export type SigninApiSuccessResponse = ApiSuccessResponse<LoginResponse>;

type UsePostSigninArgs = {
  options?: UseMutationOptions<
    LoginResponse,
    ApiErrorResponse<LoginFormFieldValues>,
    LoginFormFieldValues
  >;
};

export function usePostSignin({ options = {} }: UsePostSigninArgs) {
  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await rawAxios.post<SigninApiSuccessResponse>(
        AUTH_ROUTES.login,
        formValues
      );

      return data.data;
    },
    mutationKey: authKeys.login(),
    ...options,
  });
}
