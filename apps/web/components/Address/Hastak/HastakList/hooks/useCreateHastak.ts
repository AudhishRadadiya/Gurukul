import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { WEB_USER_HASTAK_LIST_ROUTES } from "@web/constants/routes/hastak_list/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { hastakKeys } from "@web/queryKeysFactories/hastak";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

export type CreateHastakPayload = {
  web_user_id: string | string[];
};

type UseCreateHastakArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse,
    CreateHastakPayload
  >;
};

export function useCreateHastak({ options = {} }: UseCreateHastakArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        WEB_USER_HASTAK_LIST_ROUTES.convert(),
        formValues
      );

      return data;
    },
    mutationKey: hastakKeys.convert(),
    ...options,
  });
}
