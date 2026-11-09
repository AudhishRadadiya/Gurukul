import { useQuery } from "@tanstack/react-query";

import type { WebUserMasterFormFieldValues } from "@web/components/user/web-user-master/AddWebUserMaster/WebUserMasterForm";
import type { WebUserListType } from "@web/components/user/web-user-master/WebUserMasterList/hooks/useGetWebUserMaster";
import { WEB_USER_ROUTES } from "@web/constants/routes/web_user/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { webUserKeys } from "@web/queryKeysFactories/webUser";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetWebUserMasterDetailsArgs = {
  webUserId: WebUserListType["web_user_id"];
};

export function useGetWebUserMasterDetails({
  webUserId,
}: UseGetWebUserMasterDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchWebUserMasterDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<WebUserMasterFormFieldValues>
    >(WEB_USER_ROUTES.get(webUserId));

    return data;
  };

  return useQuery({
    enabled: !!webUserId,
    queryFn: fetchWebUserMasterDetails,
    queryKey: webUserKeys.get(webUserId),
  });
}
