import { useQuery } from "@tanstack/react-query";

import type { UserMasterFormFieldValues } from "@web/components/user/user-master/AddUserMaster/UserMasterFrom";
import type { UserListType } from "@web/components/user/user-master/UserMasterList/hooks/useGetUserMaster";
import { USER_ROUTES } from "@web/constants/routes/user/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { userKeys } from "@web/queryKeysFactories/user";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetUserMasterDetailsArgs = {
  userId: UserListType["user_id"];
};

export function useGetUserMasterDetails({
  userId,
}: UseGetUserMasterDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchUserMasterDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<UserMasterFormFieldValues>>(
      USER_ROUTES.get(userId)
    );

    return data;
  };

  return useQuery({
    enabled: !!userId,
    queryFn: fetchUserMasterDetails,
    queryKey: userKeys.get(userId),
  });
}
