import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { AddressBookFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";
import { ADDRESS_BOOK_ROUTES } from "@web/constants/routes/address_book/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { addressBookKeys } from "@web/queryKeysFactories/addressBook";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseEditAddressBookArgs = {
  addressBookId: string;
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<AddressBookFormFieldValues>,
    Partial<AddressBookFormFieldValues>
  >;
};

export function useEditAddressBook({
  addressBookId,
  options = {},
}: UseEditAddressBookArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EmptyApiSuccessResponse>(
        ADDRESS_BOOK_ROUTES.patch(addressBookId),
        formValues
      );

      return data;
    },
    mutationKey: addressBookKeys.edit(addressBookId),
    ...options,
  });
}
