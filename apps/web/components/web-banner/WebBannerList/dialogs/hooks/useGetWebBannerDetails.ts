import { useQuery } from "@tanstack/react-query";

import type { WebBannerDetail } from "@web/components/web-banner/WebBannerList/hooks/useGetWebBanner";
import { WEB_BANNER_ROUTES } from "@web/constants/routes/web_banner/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { webBannerKeys } from "@web/queryKeysFactories/webBanner";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

export type WebBannerSlotImage = {
  image_height: number;
  image_id?: string;
  image_url: string;
  image_width: number;
  sequence_no?: number;
  slot_id?: string;
};

export type WebBannerSlot = {
  images: WebBannerSlotImage[];
  is_slider: boolean;
  position: number;
  slot_id?: string;
};

export type WebBannerDetailsResponse = WebBannerDetail & {
  button_link?: string | null;
  button_text?: string | null;
  event_master_id?: string[];
  identity_name: string | null;
  image?: string | null;
  is_active: boolean;
  slots: WebBannerSlot[];
};

type UseGetWebBannerDetailsArgs = {
  bannerId: WebBannerDetail["banner_id"];
};

export function useGetWebBannerDetails({
  bannerId,
}: UseGetWebBannerDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchWebBannerDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<WebBannerDetailsResponse>>(
      WEB_BANNER_ROUTES.get(bannerId)
    );

    return data;
  };

  return useQuery({
    enabled: !!bannerId,
    queryFn: fetchWebBannerDetails,
    queryKey: webBannerKeys.get(bannerId),
  });
}
