import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { DONATION_ADDRESS_LIST_ROUTES } from "@web/constants/routes/donation_address/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donorAddressKeys } from "@web/queryKeysFactories/donorAddress";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type EditDonorAddressPayload = {
  donationId: string;
  formValues: { is_ignored: boolean };
};

type UseEditDonorAddressArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse,
    EditDonorAddressPayload
  >;
};

export function useEditDonorAddress({ options = {} }: UseEditDonorAddressArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ donationId, formValues }) => {
      const { data } = await axiosPrivate.patch<EmptyApiSuccessResponse>(
        DONATION_ADDRESS_LIST_ROUTES.patch(donationId),
        formValues
      );

      return data;
    },
    mutationKey: donorAddressKeys.edit(),
    ...options,
  });
}
