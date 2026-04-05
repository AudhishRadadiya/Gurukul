import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { ADDRESS_MISMATCH_ROUTES } from "@web/constants/routes/address_book/address_mismatch/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { updateDonorAddressKeys } from "@web/queryKeysFactories/updateDonorAddress";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type MergeAddressPayload = {
  contact_id: string;
  donation_id: string;
};

type UseMergeAddressArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse,
    MergeAddressPayload
  >;
};

export function useMergeAddress({ options = {} }: UseMergeAddressArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ contact_id, donation_id }: MergeAddressPayload) => {
      const { data } = await axiosPrivate.patch<EmptyApiSuccessResponse>(
        ADDRESS_MISMATCH_ROUTES.update,
        {
          contact_id,
          donation_id,
        }
      );

      return data;
    },
    mutationKey: updateDonorAddressKeys.all,
    ...options,
  });
}
