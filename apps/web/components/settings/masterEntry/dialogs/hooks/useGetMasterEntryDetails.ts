import { useQuery } from "@tanstack/react-query";

import type { MasterParameterDetails } from "@web/components/settings/masterEntry/masterEntryList/hooks/useGetMasterEntry";
import { PARAMETER_ROUTES } from "@web/constants/routes/master_type/parameter/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { masterEntryKeys } from "@web/queryKeysFactories/masterEntry";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetMasterEntryDetailsArgs = {
  masterParameterId: MasterParameterDetails["master_parameter_id"];
};

export function useGetMasterEntryDetails({
  masterParameterId,
}: UseGetMasterEntryDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchMasterEntryDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<MasterParameterDetails>>(
      PARAMETER_ROUTES.get(masterParameterId)
    );

    return data;
  };

  return useQuery({
    enabled: !!masterParameterId,
    queryFn: fetchMasterEntryDetails,
    queryKey: masterEntryKeys.get(masterParameterId),
  });
}
