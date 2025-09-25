import { useQuery } from "@tanstack/react-query";

import { USER_ROUTES } from "@web/constants/routes/user/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { userKeys } from "@web/queryKeysFactories/user";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type UserListType = {
  allow_donation_login: boolean;
  branch_names: string;
  closed_time: string;
  days: number;
  donation_day: boolean;
  donation_edit: boolean;
  full_count: string;
  is_active: boolean;
  is_allow_print_export: boolean;
  is_full_permission: boolean;
  receipt_name: string;
  user_contact_no: string;
  user_email: string;
  user_full_name: string;
  user_id: string;
  user_login_name: string;
  user_login_otp: boolean;
  user_type: string;
  view_from: string;
};

export function useGetUserMaster(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getUserMaster = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        totalCount: number;
        userDetails: UserListType[];
      }>
    >(USER_ROUTES.listing, body);

    return data.data;
  };

  return useQuery({
    initialData: { totalCount: 0, userDetails: [] },
    queryFn: () => getUserMaster(body),
    queryKey: userKeys.listing(body),
  });
}
