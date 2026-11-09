import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { META_WHATSAPP_SETTING_ROUTES } from "@web/constants/routes/meta_whatsapp_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { metaWhatsappSettingKeys } from "@web/queryKeysFactories/metaWhatsappSetting";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseDeleteMetaWhatsappSettingArgs = {
  metaWhatsappSettingId: string;
  options: UseMutationOptions<EmptyApiSuccessResponse, ApiErrorResponse>;
};

export function useDeleteMetaWhatsappSetting({
  metaWhatsappSettingId,
  options = {},
}: UseDeleteMetaWhatsappSettingArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<EmptyApiSuccessResponse>(
        META_WHATSAPP_SETTING_ROUTES.delete(metaWhatsappSettingId)
      );

      return data;
    },
    mutationKey: metaWhatsappSettingKeys.delete(metaWhatsappSettingId),
    ...options,
  });
}

