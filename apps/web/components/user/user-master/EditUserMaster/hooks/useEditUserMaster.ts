import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { UserMasterFormFieldValues } from "@web/components/user/user-master/AddUserMaster/UserMasterFrom";
import type { UserListType } from "@web/components/user/user-master/UserMasterList/hooks/useGetUserMaster";
import { USER_ROUTES } from "@web/constants/routes/user/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { userKeys } from "@web/queryKeysFactories/user";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type EditUserMasterApiResponse = ApiSuccessResponse<UserListType>;

type UseEditUserMasterArgs = {
  options: UseMutationOptions<
    EditUserMasterApiResponse,
    ApiErrorResponse<UserMasterFormFieldValues>,
    Partial<UserMasterFormFieldValues>
  >;
  userId: string;
};

export function useEditUserMaster({
  options = {},
  userId,
}: UseEditUserMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditUserMasterApiResponse>(
        USER_ROUTES.patch(userId),
        formValues
      );

      return data;
    },
    mutationKey: userKeys.edit(userId),
    ...options,
  });
}
