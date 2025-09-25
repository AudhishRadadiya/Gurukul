import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { AddressType } from "@web/components/settings/address-type-master/AddressTypeMasterList/hooks/useGetAddressTypeMaster";
import type { AddressTypeFormFieldValues } from "@web/components/settings/address-type-master/Dialogs/AddressTypeFrom";
import { ADDRESS_TYPE_ROUTES } from "@web/constants/routes/address_type/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { addressTypeKeys } from "@web/queryKeysFactories/addressType";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type EditAddressTypeApiResponse = ApiSuccessResponse<AddressType>;

type UseEditAddressTypeMasterArgs = {
  addressTypeId: string;
  options: UseMutationOptions<
    EditAddressTypeApiResponse,
    ApiErrorResponse<AddressTypeFormFieldValues>,
    Partial<AddressTypeFormFieldValues>
  >;
};

export function useEditAddressTypeMaster({
  addressTypeId,
  options = {},
}: UseEditAddressTypeMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditAddressTypeApiResponse>(
        ADDRESS_TYPE_ROUTES.patch(addressTypeId),
        formValues
      );

      return data;
    },
    mutationKey: addressTypeKeys.edit(addressTypeId),
    ...options,
  });
}
