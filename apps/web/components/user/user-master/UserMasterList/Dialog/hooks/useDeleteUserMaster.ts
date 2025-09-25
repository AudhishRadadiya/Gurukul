import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { UserListType } from "@web/components/user/user-master/UserMasterList/hooks/useGetUserMaster";
import { USER_ROUTES } from "@web/constants/routes/user/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { userKeys } from "@web/queryKeysFactories/user";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type DeleteUserMasterApiResponse = ApiSuccessResponse<UserListType>;

type UseDeleteUserMasterArgs = {
  options: UseMutationOptions<DeleteUserMasterApiResponse, ApiErrorResponse>;
  userId: string;
};

export function useDeleteUserMaster({
  options = {},
  userId,
}: UseDeleteUserMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteUserMasterApiResponse>(
        USER_ROUTES.delete(userId)
      );

      return data;
    },
    mutationKey: userKeys.delete(userId),
    ...options,
  });
}
