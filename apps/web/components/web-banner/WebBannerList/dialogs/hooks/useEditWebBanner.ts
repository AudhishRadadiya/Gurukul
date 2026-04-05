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

type UseEditWebBannerArgs = {
  bannerId: string;
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<WebBannerFormFieldValues>,
    WebBannerPayload
  >;
};

export function useEditWebBanner({
  bannerId,
  options = {},
}: UseEditWebBannerArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EmptyApiSuccessResponse>(
        WEB_BANNER_ROUTES.patch(bannerId),
        formValues
      );

      return data;
    },
    mutationKey: webBannerKeys.edit(bannerId),
    ...options,
  });
}
