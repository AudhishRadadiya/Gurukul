import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { AddressTypeFormFieldValues } from "@web/components/settings/address-type-master/Dialogs/AddressTypeFrom";
import { ADDRESS_TYPE_ROUTES } from "@web/constants/routes/address_type/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { addressTypeKeys } from "@web/queryKeysFactories/addressType";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type AddAddressTypeMasterApiSuccessResponse =
  ApiSuccessResponse<AddressTypeFormFieldValues>;

type UseAddAddressTypeMasterArgs = {
  options: UseMutationOptions<
    AddAddressTypeMasterApiSuccessResponse,
    ApiErrorResponse<AddressTypeFormFieldValues>,
    Partial<AddressTypeFormFieldValues>
  >;
};

export function useAddAddressType({
  options = {},
}: UseAddAddressTypeMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddAddressTypeMasterApiSuccessResponse>(
          ADDRESS_TYPE_ROUTES.post,
          formValues
        );

      return data;
    },
    mutationKey: addressTypeKeys.add(),
    ...options,
  });
}
