import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { LIST_LAYOUT_ROUTES } from "@web/constants/routes/list_layout/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { layoutKeys } from "@web/queryKeysFactories/layout";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

export type UseDeleteLayoutArgs = {
  layoutId: string | number;
  options: UseMutationOptions<EmptyApiSuccessResponse, ApiErrorResponse>;
};

export function useDeleteLayout({
  layoutId,
  options = {},
}: UseDeleteLayoutArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<EmptyApiSuccessResponse>(
        LIST_LAYOUT_ROUTES.delete(layoutId)
      );

      return data;
    },
    mutationKey: layoutKeys.delete(layoutId),
    ...options,
  });
}
