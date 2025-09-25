import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { DonorAddressValues } from "@web/app/address/donor-address/page";
import { DONATION_ADDRESS_LIST_ROUTES } from "@web/constants/routes/donation_address/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donorAddressKeys } from "@web/queryKeysFactories/donorAddress";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type EditAllInActiveDonorAddressPayload = {
  address_book_ids: string[];
};

type UseEditAllInActiveDonorAddressArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<DonorAddressValues>,
    EditAllInActiveDonorAddressPayload
  >;
};

export function useEditAllInActiveDonorAddress({
  options = {},
}: UseEditAllInActiveDonorAddressArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EmptyApiSuccessResponse>(
        DONATION_ADDRESS_LIST_ROUTES.multiIgnored(),
        formValues
      );

      return data;
    },
    mutationKey: donorAddressKeys.edit(),
    ...options,
  });
}
