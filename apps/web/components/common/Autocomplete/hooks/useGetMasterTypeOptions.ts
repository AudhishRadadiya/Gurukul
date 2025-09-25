import { useQuery } from "@tanstack/react-query";

import { MASTER_TYPE_ROUTES } from "@web/constants/routes/master_type/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { masterTypeKeys } from "@web/queryKeysFactories/masterType";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export function useGetMasterTypeOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchMasterTypeOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      MASTER_TYPE_ROUTES.options
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchMasterTypeOption,
    queryKey: masterTypeKeys.options(),
  });
}
