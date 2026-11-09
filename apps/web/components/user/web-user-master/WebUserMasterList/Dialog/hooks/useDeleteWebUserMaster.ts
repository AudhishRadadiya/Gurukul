import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { WebUserListType } from "@web/components/user/web-user-master/WebUserMasterList/hooks/useGetWebUserMaster";
import { WEB_USER_ROUTES } from "@web/constants/routes/web_user/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { webUserKeys } from "@web/queryKeysFactories/webUser";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type DeleteWebUserMasterApiResponse = ApiSuccessResponse<WebUserListType>;

type UseDeleteWebUserMasterArgs = {
  options: UseMutationOptions<DeleteWebUserMasterApiResponse, ApiErrorResponse>;
  webUserId: string;
};

export function useDeleteWebUserMaster({
  options = {},
  webUserId,
}: UseDeleteWebUserMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () =>
      (
        await axiosPrivate.delete<ApiSuccessResponse<WebUserListType>>(
          WEB_USER_ROUTES.delete(webUserId)
        )
      ).data,
    mutationKey: webUserKeys.delete(webUserId),
    ...options,
  });
}
