import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { MetaWhatsappTemplateFormFieldValues } from "@web/components/settings/metaWhatsappTemplate/dialogs/MetaWhatsappTemplateForm";
import { META_WHATSAPP_TEMPLATE_ROUTES } from "@web/constants/routes/meta_whatsapp_template/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { metaWhatsappTemplateKeys } from "@web/queryKeysFactories/metaWhatsappTemplate";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseAddMetaWhatsappTemplateArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<MetaWhatsappTemplateFormFieldValues>,
    Partial<MetaWhatsappTemplateFormFieldValues>
  >;
};

export function useAddMetaWhatsappTemplate({
  options = {},
}: UseAddMetaWhatsappTemplateArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        META_WHATSAPP_TEMPLATE_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: metaWhatsappTemplateKeys.add(),
    ...options,
  });
}
