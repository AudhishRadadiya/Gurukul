import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { META_WHATSAPP_TEMPLATE_ROUTES } from "@web/constants/routes/meta_whatsapp_template/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { metaWhatsappTemplateKeys } from "@web/queryKeysFactories/metaWhatsappTemplate";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseDeleteMetaWhatsappTemplateArgs = {
  metaWhatsappTemplateId: string;
  options: UseMutationOptions<EmptyApiSuccessResponse, ApiErrorResponse, void>;
};

export function useDeleteMetaWhatsappTemplate({
  metaWhatsappTemplateId,
  options = {},
}: UseDeleteMetaWhatsappTemplateArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<EmptyApiSuccessResponse>(
        META_WHATSAPP_TEMPLATE_ROUTES.delete(metaWhatsappTemplateId)
      );

      return data;
    },
    mutationKey: metaWhatsappTemplateKeys.delete(metaWhatsappTemplateId),
    ...options,
  });
}

