import { useQuery } from "@tanstack/react-query";

import type { AddressBookFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";
import { ADDRESS_BOOK_ROUTES } from "@web/constants/routes/address_book/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { addressBookKeys } from "@web/queryKeysFactories/addressBook";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetAddressBookDetailsArgs = {
  addressBookId: string;
};

export function useGetAddressBookDetails({
  addressBookId,
}: UseGetAddressBookDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchAddressBookDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<AddressBookFormFieldValues>>(
      ADDRESS_BOOK_ROUTES.get(addressBookId)
    );

    return data;
  };

  return useQuery({
    enabled: !!addressBookId,
    queryFn: fetchAddressBookDetails,
    queryKey: addressBookKeys.get(addressBookId),
  });
}
