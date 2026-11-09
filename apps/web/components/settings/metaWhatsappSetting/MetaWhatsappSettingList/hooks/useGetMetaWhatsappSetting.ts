import { useQuery } from "@tanstack/react-query";

import { META_WHATSAPP_SETTING_ROUTES } from "@web/constants/routes/meta_whatsapp_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { metaWhatsappSettingKeys } from "@web/queryKeysFactories/metaWhatsappSetting";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type MetaWhatsappSettingDetail = {
  api_key: string;
  full_count: string;
  is_active: boolean;
  is_deleted: boolean;
  meta_whatsapp_setting_id: string;
  phone_number_id: string;
  title: string;
  url: string;
  waba_id: string;
};

export type GetMetaWhatsappSettingSuccessResponse = ApiSuccessResponse<{
  metaWhatsappSettingDetail: MetaWhatsappSettingDetail[];
  totalCount: number;
}>;

export function useGetMetaWhatsappSetting(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getMetaWhatsappSetting = async (body: GetListArgsAg2) => {
    const { data } =
      await axiosPrivate.post<GetMetaWhatsappSettingSuccessResponse>(
        META_WHATSAPP_SETTING_ROUTES.listing,
        body
      );

    return data.data;
  };

  return useQuery({
    initialData: { metaWhatsappSettingDetail: [], totalCount: 0 },
    queryFn: () => getMetaWhatsappSetting(body),
    queryKey: metaWhatsappSettingKeys.listing(body),
  });
}
