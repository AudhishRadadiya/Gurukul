import { toasts } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import type { FiltersModuleKey } from "@web/hooks/savedFilters/useGetSavedFilters";
import { useGetSavedFilters } from "@web/hooks/savedFilters/useGetSavedFilters";
import { useSaveFilters } from "@web/hooks/savedFilters/useSaveFilters";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

type UseSavedFiltersHandlerProps = {
  moduleKey: FiltersModuleKey;
};

type SaveFiltersActionProps = {
  filters: FieldValues;
  is_save_filter: boolean;
};

export const useSavedFiltersHandler = ({
  moduleKey,
}: UseSavedFiltersHandlerProps) => {
  const { data, isFetching: isFetchingSavedFilters } = useGetSavedFilters({
    moduleKey,
  });

  const { filters, is_save_filter: isSaveFilter } = data;

  const { isPending: isPendingSaveFilters, mutate: saveFilters } =
    useSaveFilters({
      moduleKey,

      options: {
        onError: (error) => onError(error),

        onSuccess: ({ message }: EmptyApiSuccessResponse) => {
          toasts.success({
            title: message,
          });
        },
      },
    });

  const saveFiltersAction = ({
    filters,
    is_save_filter,
  }: SaveFiltersActionProps) => {
    saveFilters({
      body: {
        filters,
        is_save_filter,
      },
    });
  };

  return {
    filters,
    isFetchingSavedFilters,

    isPendingSaveFilters,
    isSaveFilter,
    saveFiltersAction,
  };
};
