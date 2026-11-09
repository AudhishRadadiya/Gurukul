import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { WebUserMasterFormFieldValues } from "@web/components/user/web-user-master/AddWebUserMaster/WebUserMasterForm";
import type { WebUserListType } from "@web/components/user/web-user-master/WebUserMasterList/hooks/useGetWebUserMaster";
import { WEB_USER_ROUTES } from "@web/constants/routes/web_user/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { webUserKeys } from "@web/queryKeysFactories/webUser";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type EditWebUserMasterApiResponse = ApiSuccessResponse<WebUserListType>;

type UseEditWebUserMasterArgs = {
  options: UseMutationOptions<
    EditWebUserMasterApiResponse,
    ApiErrorResponse<WebUserMasterFormFieldValues>,
    Partial<WebUserMasterFormFieldValues>
  >;
  webUserId: string;
};

export function useEditWebUserMaster({
  options = {},
  webUserId,
}: UseEditWebUserMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditWebUserMasterApiResponse>(
        WEB_USER_ROUTES.patch(webUserId),
        formValues
      );

      return data;
    },
    mutationKey: webUserKeys.edit(webUserId),
    ...options,
  });
}
