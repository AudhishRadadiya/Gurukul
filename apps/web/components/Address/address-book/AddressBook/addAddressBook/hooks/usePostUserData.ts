import { useQuery } from "@tanstack/react-query";
import _isFunction from "lodash/isFunction";
import _isNull from "lodash/isNull";

import type { AddressBookFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";
import { ADDRESS_BOOK_ROUTES } from "@web/constants/routes/address_book/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { addressBookKeys } from "@web/queryKeysFactories/addressBook";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UsePostUserDataArgs = {
  contactNo: string;
  onSuccess?: (data: AddressBookFormFieldValues) => void;
};

type UsePostUserDataSuccessResponse =
  ApiSuccessResponse<AddressBookFormFieldValues>;

export function usePostUserData({ contactNo, onSuccess }: UsePostUserDataArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchUserData = async () => {
    const { data } = await axiosPrivate.post<UsePostUserDataSuccessResponse>(
      ADDRESS_BOOK_ROUTES.userData,
      {
        contact_no: contactNo,
      }
    );

    if (_isFunction(onSuccess) && !_isNull(data?.data)) {
      onSuccess(data.data);
    }

    return data.data;
  };

  return useQuery({
    enabled: !!contactNo,
    queryFn: fetchUserData,
    queryKey: addressBookKeys.userData(contactNo),
  });
}
