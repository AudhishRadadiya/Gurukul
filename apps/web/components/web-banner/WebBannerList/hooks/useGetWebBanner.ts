import { useQuery } from "@tanstack/react-query";

import { WEB_BANNER_ROUTES } from "@web/constants/routes/web_banner/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { webBannerKeys } from "@web/queryKeysFactories/webBanner";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type WebBannerDetail = {
  banner_id: string;
  event_names: string;
  full_count: string;
  identity_name: string;
  is_active: boolean;
  is_deleted: boolean;
  is_home: boolean;
};

export function useGetWebBanner(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getWebBanner = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        totalCount: number;
        webBannerDetail: WebBannerDetail[];
      }>
    >(WEB_BANNER_ROUTES.listing, body);

    return data.data;
  };

  return useQuery({
    initialData: { totalCount: 0, webBannerDetail: [] },
    queryFn: () => getWebBanner(body),
    queryKey: webBannerKeys.listing(body),
  });
}
