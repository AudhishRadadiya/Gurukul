import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { UserMasterFormFieldValues } from "@web/components/user/user-master/AddUserMaster/UserMasterFrom";
import { USER_ROUTES } from "@web/constants/routes/user/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { userKeys } from "@web/queryKeysFactories/user";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type AddUserMasterApiSuccessResponse =
  ApiSuccessResponse<UserMasterFormFieldValues>;

type UseAddUserMasterArgs = {
  options: UseMutationOptions<
    AddUserMasterApiSuccessResponse,
    ApiErrorResponse<UserMasterFormFieldValues>,
    Partial<UserMasterFormFieldValues>
  >;
};

export function useAddUserMaster({ options = {} }: UseAddUserMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddUserMasterApiSuccessResponse>(
        USER_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: userKeys.add(),
    ...options,
  });
}
