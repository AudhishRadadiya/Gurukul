import { useQuery } from "@tanstack/react-query";

import { META_WHATSAPP_TEMPLATE_ROUTES } from "@web/constants/routes/meta_whatsapp_template/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { metaWhatsappTemplateKeys } from "@web/queryKeysFactories/metaWhatsappTemplate";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type MetaWhatsappTemplateDetail = {
  full_count: string;
  is_active: boolean;
  meta_whatsapp_number: string;
  meta_whatsapp_template_id: string;
  module_name: string;
  template_id: string;
  template_name: string;
};

export type GetMetaWhatsappTemplateSuccessResponse = ApiSuccessResponse<{
  metaWhatsappTemplateDetail: MetaWhatsappTemplateDetail[];
  totalCount: number;
}>;

export function useGetMetaWhatsappTemplate(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getMetaWhatsappTemplate = async (body: GetListArgsAg2) => {
    const { data } =
      await axiosPrivate.post<GetMetaWhatsappTemplateSuccessResponse>(
        META_WHATSAPP_TEMPLATE_ROUTES.listing,
        body
      );

    return data.data;
  };

  return useQuery({
    initialData: { metaWhatsappTemplateDetail: [], totalCount: 0 },
    queryFn: () => getMetaWhatsappTemplate(body),
    queryKey: metaWhatsappTemplateKeys.listing(body),
  });
}
