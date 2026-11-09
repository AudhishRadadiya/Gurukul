import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";

import { MODULE_FILTER_ROUTES } from "@web/constants/routes/module_filter/routes";
import type { FiltersModuleKey } from "@web/hooks/savedFilters/useGetSavedFilters";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { savedFiltersKeys } from "@web/queryKeysFactories/savedFilters";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type SaveFiltersArgs = {
  filters: FieldValues;
  is_save_filter: boolean;
  module_key: FiltersModuleKey;
};

type SaveFiltersMutationVariables = {
  body?: Partial<IGetRowsParams & SaveFiltersArgs>;
};

type UseSaveFiltersArgs = {
  moduleKey: FiltersModuleKey;
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<SaveFiltersArgs>,
    SaveFiltersMutationVariables
  >;
};

export function useSaveFilters({
  moduleKey,
  options = {},
}: UseSaveFiltersArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const saveFilters = async ({ body }: SaveFiltersMutationVariables) => {
    const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
      MODULE_FILTER_ROUTES.post,
      { ...body, module_key: moduleKey }
    );

    return data;
  };

  return useMutation({
    mutationFn: saveFilters,
    mutationKey: savedFiltersKeys.saveFilters(moduleKey),
    ...options,
  });
}
