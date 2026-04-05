import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { WEB_BANNER_ROUTES } from "@web/constants/routes/web_banner/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { webBannerKeys } from "@web/queryKeysFactories/webBanner";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseDeleteWebBannerArgs = {
  bannerId: string;
  options: UseMutationOptions<EmptyApiSuccessResponse, ApiErrorResponse>;
};

export function useDeleteWebBanner({
  bannerId,
  options = {},
}: UseDeleteWebBannerArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<EmptyApiSuccessResponse>(
        WEB_BANNER_ROUTES.delete(bannerId)
      );

      return data;
    },
    mutationKey: webBannerKeys.delete(bannerId),
    ...options,
  });
}
