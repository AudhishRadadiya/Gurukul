import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { DONATION_ADDRESS_LIST_ROUTES } from "@web/constants/routes/donation_address/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donorAddressKeys } from "@web/queryKeysFactories/donorAddress";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

export type CreateContactPayload = {
  address_type_id: string;
  donation_ids: string[];
};

type UseCreateContactArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse,
    CreateContactPayload
  >;
};

export function useCreateContact({ options = {} }: UseCreateContactArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        DONATION_ADDRESS_LIST_ROUTES.convert(),
        formValues
      );

      return data;
    },
    mutationKey: donorAddressKeys.convert(),
    ...options,
  });
}
