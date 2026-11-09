import { useQuery } from "@tanstack/react-query";

import { WHATSAPP_HISTORY_ROUTES } from "@web/constants/routes/whatsapp_history/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { whatsappHistoryKeys } from "@web/queryKeysFactories/whatsappHistory";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type WhatsappHistory = {
  created_at: string;
  message: string;
  phone: string;
  status: string;
};

type GetWhatsappHistoryPayload = {
  totalCount: number;
  whatsappHistoryDetails: WhatsappHistory[];
};

export function useGetWhatsappHistory(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getWhatsappHistory = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<GetWhatsappHistoryPayload>
    >(WHATSAPP_HISTORY_ROUTES.listing, body);

    return data.data;
  };

  return useQuery({
    initialData: { totalCount: 0, whatsappHistoryDetails: [] },
    queryFn: () => getWhatsappHistory(body),
    queryKey: whatsappHistoryKeys.listing(body),
  });
}
