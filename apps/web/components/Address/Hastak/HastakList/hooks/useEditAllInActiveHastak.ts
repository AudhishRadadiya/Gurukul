import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { WEB_USER_HASTAK_LIST_ROUTES } from "@web/constants/routes/hastak_list/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { hastakKeys } from "@web/queryKeysFactories/hastak";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type EditAllInActiveHastakPayload = {
  web_user_ids: string[];
};

type UseEditAllInActiveHastakArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse,
    EditAllInActiveHastakPayload
  >;
};

export function useEditAllInActiveHastak({
  options = {},
}: UseEditAllInActiveHastakArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EmptyApiSuccessResponse>(
        WEB_USER_HASTAK_LIST_ROUTES.multiIgnored(),
        formValues
      );

      return data;
    },
    mutationKey: hastakKeys.edit(),
    ...options,
  });
}
