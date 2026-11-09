import { useQuery } from "@tanstack/react-query";
import type { FieldValues } from "react-hook-form";

import { MODULE_FILTER_ROUTES } from "@web/constants/routes/module_filter/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { savedFiltersKeys } from "@web/queryKeysFactories/savedFilters";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

export type FiltersModuleKey = "donation" | "event" | "address";

type GetSavedFiltersResponse = ApiSuccessResponse<{
  filter_id: string;
  filters: FieldValues;
  is_save_filter: boolean;
  module_key: FiltersModuleKey;
}>;

type UseGetSavedFiltersArgs = {
  moduleKey: FiltersModuleKey;
};

export function useGetSavedFilters({ moduleKey }: UseGetSavedFiltersArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSavedFilters = async () => {
    const { data } = await axiosPrivate.get<GetSavedFiltersResponse>(
      MODULE_FILTER_ROUTES.get(moduleKey)
    );

    return data.data;
  };

  return useQuery({
    initialData: {
      filter_id: "",
      filters: {},
      is_save_filter: false,
      module_key: moduleKey,
    },
    queryFn: fetchSavedFilters,
    queryKey: savedFiltersKeys.getSavedFilters(moduleKey),
  });
}
