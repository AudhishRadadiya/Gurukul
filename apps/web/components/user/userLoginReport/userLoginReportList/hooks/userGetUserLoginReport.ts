import { useQuery } from "@tanstack/react-query";

import { USER_LOGIN_REPORT_ROUTES } from "@web/constants/routes/user_login_report/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { userLoginReportKeys } from "@web/queryKeysFactories/userLoginReport";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type UserLoginReport = {
  full_count: string;
  ip_address: string;
  login_time: string;
  logout_time: string;
  mac_address: string;
  remark: string;
  user_name: string;
};

export function userGetUserLoginReport(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getAddressType = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        totalCount: number;
        userLoginDetails: UserLoginReport[];
      }>
    >(USER_LOGIN_REPORT_ROUTES.listing, body);

    return data.data;
  };

  return useQuery({
    initialData: { totalCount: 0, userLoginDetails: [] },
    queryFn: () => getAddressType(body),
    queryKey: userLoginReportKeys.listing(body),
  });
}
