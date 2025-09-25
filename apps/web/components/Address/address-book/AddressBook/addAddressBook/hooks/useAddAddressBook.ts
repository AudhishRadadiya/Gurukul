import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { AddressBookFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";
import { ADDRESS_BOOK_ROUTES } from "@web/constants/routes/address_book/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { addressBookKeys } from "@web/queryKeysFactories/addressBook";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type AddAddressBookApiSuccessResponse =
  ApiSuccessResponse<AddressBookFormFieldValues>;

type UseAddAddressBookArgs = {
  options: UseMutationOptions<
    AddAddressBookApiSuccessResponse,
    ApiErrorResponse<AddressBookFormFieldValues>,
    Partial<AddressBookFormFieldValues>
  >;
};

export function useAddAddressBook({ options = {} }: UseAddAddressBookArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddAddressBookApiSuccessResponse>(
          ADDRESS_BOOK_ROUTES.post,
          formValues
        );

      return data;
    },
    mutationKey: addressBookKeys.add(),
    ...options,
  });
}
