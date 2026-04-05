import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type {
  WebBannerFormFieldValues,
  WebBannerPayload,
} from "@web/components/web-banner/dialogs/WebBannerForm";
import { WEB_BANNER_ROUTES } from "@web/constants/routes/web_banner/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { webBannerKeys } from "@web/queryKeysFactories/webBanner";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseAddWebBannerArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<WebBannerFormFieldValues>,
    WebBannerPayload
  >;
};

export function useAddWebBanner({ options = {} }: UseAddWebBannerArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        WEB_BANNER_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: webBannerKeys.add(),
    ...options,
  });
}
