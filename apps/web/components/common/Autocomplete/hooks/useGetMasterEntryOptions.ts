import { useQuery } from "@tanstack/react-query";

import { PARAMETER_ROUTES } from "@web/constants/routes/master_type/parameter/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { masterEntryKeys } from "@web/queryKeysFactories/masterEntry";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export function useGetMasterEntryOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchMasterEntryOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      PARAMETER_ROUTES.options
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchMasterEntryOption,
    queryKey: masterEntryKeys.options(),
  });
}
