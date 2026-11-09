import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { WebUserMasterFormFieldValues } from "@web/components/user/web-user-master/AddWebUserMaster/WebUserMasterForm";
import { WEB_USER_ROUTES } from "@web/constants/routes/web_user/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { webUserKeys } from "@web/queryKeysFactories/webUser";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type AddWebUserMasterApiSuccessResponse =
  ApiSuccessResponse<WebUserMasterFormFieldValues>;

type WebUseAddUserMasterArgs = {
  options: UseMutationOptions<
    AddWebUserMasterApiSuccessResponse,
    ApiErrorResponse<WebUserMasterFormFieldValues>,
    Partial<WebUserMasterFormFieldValues>
  >;
};

export function useAddWebUserMaster({ options = {} }: WebUseAddUserMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddWebUserMasterApiSuccessResponse>(
          WEB_USER_ROUTES.post,
          formValues
        );

      return data;
    },
    mutationKey: webUserKeys.add(),
    ...options,
  });
}
