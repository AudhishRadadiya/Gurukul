import { useQuery } from "@tanstack/react-query";

import { MASTER_TYPE_ROUTES } from "@web/constants/routes/master_type/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { masterTypeKeys } from "@web/queryKeysFactories/masterType";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export type MasterTypeParametersKey =
  | "CATEGORY"
  | "HASTAK"
  | "ZONE"
  | "BUSINESS"
  | "GURUKUL"
  | "SAINT"
  | "EDUCATION";

export type MasterTypeParametersOptionsSuccessResponse = ApiSuccessResponse<{
  [K in MasterTypeParametersKey]: OptionsType[];
}>;

export function useGetMasterTypeParametersOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const getMasterTypeParameters = async () => {
    const { data } =
      await axiosPrivate.get<MasterTypeParametersOptionsSuccessResponse>(
        MASTER_TYPE_ROUTES.parameterOptions
      );

    return data.data;
  };

  return useQuery({
    initialData: {
      BUSINESS: [],
      CATEGORY: [],
      EDUCATION: [],
      GURUKUL: [],
      HASTAK: [],
      SAINT: [],
      ZONE: [],
    },
    queryFn: getMasterTypeParameters,
    queryKey: masterTypeKeys.parameterOptions(),
  });
}
