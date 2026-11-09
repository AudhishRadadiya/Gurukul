import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { MetaWhatsappSettingFormFieldValues } from "@web/components/settings/metaWhatsappSetting/dialogs/MetaWhatsappSettingForm";
import { META_WHATSAPP_SETTING_ROUTES } from "@web/constants/routes/meta_whatsapp_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { metaWhatsappSettingKeys } from "@web/queryKeysFactories/metaWhatsappSetting";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseAddMetaWhatsappSettingArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse,
    Partial<MetaWhatsappSettingFormFieldValues>
  >;
};

export function useAddMetaWhatsappSetting({
  options = {},
}: UseAddMetaWhatsappSettingArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        META_WHATSAPP_SETTING_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: metaWhatsappSettingKeys.add(),
    ...options,
  });
}
