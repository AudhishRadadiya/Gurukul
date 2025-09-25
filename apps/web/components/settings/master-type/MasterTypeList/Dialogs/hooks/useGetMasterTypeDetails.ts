import { useQuery } from "@tanstack/react-query";

import type { MasterType } from "@web/components/settings/master-type/MasterTypeList/hooks/useGetMasterType";
import { MASTER_TYPE_ROUTES } from "@web/constants/routes/master_type/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { masterTypeKeys } from "@web/queryKeysFactories/masterType";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetMasterTypeDetailsArgs = {
  masterTypeId: MasterType["master_type_id"];
};

export function useGetMasterTypeDetails({
  masterTypeId,
}: UseGetMasterTypeDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchMasterTypeDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<MasterType>>(
      MASTER_TYPE_ROUTES.get(masterTypeId)
    );

    return data;
  };

  return useQuery({
    enabled: !!masterTypeId,
    queryFn: fetchMasterTypeDetails,
    queryKey: masterTypeKeys.get(masterTypeId),
  });
}
