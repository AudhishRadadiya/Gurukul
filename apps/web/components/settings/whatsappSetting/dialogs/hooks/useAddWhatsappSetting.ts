import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { WhatsappSettingFormFieldValues } from "@web/components/settings/whatsappSetting/dialogs/WhatsappSettingForm";
import { WHATSAPP_SETTING_ROUTES } from "@web/constants/routes/whatsapp_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { whatsappSettingKeys } from "@web/queryKeysFactories/whatsappSetting";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseAddWhatsappSettingArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse,
    Partial<WhatsappSettingFormFieldValues>
  >;
};

export function useAddWhatsappSetting({
  options = {},
}: UseAddWhatsappSettingArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        WHATSAPP_SETTING_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: whatsappSettingKeys.add(),
    ...options,
  });
}
