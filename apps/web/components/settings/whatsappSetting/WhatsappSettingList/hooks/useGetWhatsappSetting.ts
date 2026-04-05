import { useQuery } from "@tanstack/react-query";

import { WHATSAPP_SETTING_ROUTES } from "@web/constants/routes/whatsapp_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { whatsappSettingKeys } from "@web/queryKeysFactories/whatsappSetting";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type WhatsappSettingDetail = {
  full_count: string;
  is_active: boolean;
  whatsapp_client: string;
  whatsapp_number: string;
  whatsapp_setting_id: string;
};

export type GetWhatsappSettingSuccessResponse = ApiSuccessResponse<{
  totalCount: number;
  whatsappSettingDetail: WhatsappSettingDetail[];
}>;

export function useGetWhatsappSetting(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getWhatsappSetting = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetWhatsappSettingSuccessResponse>(
      WHATSAPP_SETTING_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { totalCount: 0, whatsappSettingDetail: [] },
    queryFn: () => getWhatsappSetting(body),
    queryKey: whatsappSettingKeys.listing(body),
  });
}
