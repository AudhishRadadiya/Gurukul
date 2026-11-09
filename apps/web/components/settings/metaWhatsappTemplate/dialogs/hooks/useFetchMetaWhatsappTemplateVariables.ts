import { useQuery } from "@tanstack/react-query";

import type { MetaWhatsappTemplateVariable } from "@web/components/settings/metaWhatsappTemplate/dialogs/MetaWhatsappTemplateForm";
import { META_WHATSAPP_TEMPLATE_ROUTES } from "@web/constants/routes/meta_whatsapp_template/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { metaWhatsappTemplateKeys } from "@web/queryKeysFactories/metaWhatsappTemplate";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

export type FetchMetaWhatsappTemplateVariablesSuccessResponse =
  ApiSuccessResponse<{
    template_id: string;
    template_name: string;
    variables: MetaWhatsappTemplateVariable[];
  }>;

type UseFetchMetaWhatsappTemplateVariablesArgs = {
  metaWhatsappSettingId: string | null;
  templateId: string | null;
};

export function useFetchMetaWhatsappTemplateVariables({
  metaWhatsappSettingId,
  templateId,
}: UseFetchMetaWhatsappTemplateVariablesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchVariables = async () => {
    const { data } =
      await axiosPrivate.post<FetchMetaWhatsappTemplateVariablesSuccessResponse>(
        META_WHATSAPP_TEMPLATE_ROUTES.fetchVariables,
        {
          meta_whatsapp_setting_id: metaWhatsappSettingId,
          template_id: templateId,
        }
      );

    return data.data;
  };

  return useQuery({
    enabled: !!metaWhatsappSettingId && !!templateId,
    queryFn: fetchVariables,
    queryKey: metaWhatsappTemplateKeys.fetchVariables({
      metaWhatsappSettingId,
      templateId,
    }),
  });
}
