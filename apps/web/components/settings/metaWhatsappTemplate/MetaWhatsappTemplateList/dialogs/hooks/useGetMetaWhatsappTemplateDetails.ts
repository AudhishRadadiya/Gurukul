import { useQuery } from "@tanstack/react-query";

import type { MetaWhatsappTemplateFormFieldValues } from "@web/components/settings/metaWhatsappTemplate/dialogs/MetaWhatsappTemplateForm";
import { META_WHATSAPP_TEMPLATE_ROUTES } from "@web/constants/routes/meta_whatsapp_template/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { metaWhatsappTemplateKeys } from "@web/queryKeysFactories/metaWhatsappTemplate";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetMetaWhatsappTemplateDetailsArgs = {
  metaWhatsappTemplateId: string;
};

export function useGetMetaWhatsappTemplateDetails({
  metaWhatsappTemplateId,
}: UseGetMetaWhatsappTemplateDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchMetaWhatsappTemplateDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<MetaWhatsappTemplateFormFieldValues>
    >(META_WHATSAPP_TEMPLATE_ROUTES.get(metaWhatsappTemplateId));

    return data;
  };

  return useQuery({
    queryFn: fetchMetaWhatsappTemplateDetails,
    queryKey: metaWhatsappTemplateKeys.get(metaWhatsappTemplateId),
  });
}
