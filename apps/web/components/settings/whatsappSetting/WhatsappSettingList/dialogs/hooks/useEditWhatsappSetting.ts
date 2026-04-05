import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { WhatsappSettingFormFieldValues } from "@web/components/settings/whatsappSetting/dialogs/WhatsappSettingForm";
import type { WhatsappSettingDetail } from "@web/components/settings/whatsappSetting/WhatsappSettingList/hooks/useGetWhatsappSetting";
import { WHATSAPP_SETTING_ROUTES } from "@web/constants/routes/whatsapp_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { whatsappSettingKeys } from "@web/queryKeysFactories/whatsappSetting";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseEditWhatsappSettingArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<WhatsappSettingFormFieldValues>,
    Partial<WhatsappSettingFormFieldValues>
  >;
  whatsappSettingId: WhatsappSettingDetail["whatsapp_setting_id"];
};

export function useEditWhatsappSetting({
  options = {},
  whatsappSettingId,
}: UseEditWhatsappSettingArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EmptyApiSuccessResponse>(
        WHATSAPP_SETTING_ROUTES.patch(whatsappSettingId),
        formValues
      );

      return data;
    },
    mutationKey: whatsappSettingKeys.edit(whatsappSettingId),
    ...options,
  });
}
