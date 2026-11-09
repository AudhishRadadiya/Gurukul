import { useQuery } from "@tanstack/react-query";

import { WEB_USER_ROUTES } from "@web/constants/routes/web_user/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { webUserKeys } from "@web/queryKeysFactories/webUser";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type WebUserListType = {
  email: string;
  father_name: string;
  full_count: string;
  hastak_mobile_no: string;
  hastak_name: string;
  is_active: boolean;
  mobile_no: string;
  otp: string;
  sur_name: string;
  web_user_id: string;
  your_name: string;
};

export function useGetWebUserMaster(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getWebUserMaster = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        totalCount: number;
        webUserDetails: WebUserListType[];
      }>
    >(WEB_USER_ROUTES.listing, body);

    return data.data;
  };

  return useQuery({
    initialData: { totalCount: 0, webUserDetails: [] as WebUserListType[] },
    queryFn: () => getWebUserMaster(body),
    queryKey: webUserKeys.listing(body),
  });
}
