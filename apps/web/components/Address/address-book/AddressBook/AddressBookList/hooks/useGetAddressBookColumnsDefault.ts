import { useQuery } from "@tanstack/react-query";

import { ADDRESS_BOOK_ROUTES } from "@web/constants/routes/address_book/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { addressBookKeys } from "@web/queryKeysFactories/addressBook";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type AddressBookColumnsDefaultData = Record<string, boolean>;

type GetAddressBookColumnsDefaultResponse =
  ApiSuccessResponse<AddressBookColumnsDefaultData>;

export function useGetAddressBookColumnsDefault() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDefaultColumns = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<GetAddressBookColumnsDefaultResponse>(
      ADDRESS_BOOK_ROUTES.columnsDefault
    );

    return data;
  };

  return useQuery({
    queryFn: fetchDefaultColumns,
    queryKey: addressBookKeys.columnsDefault(),
  });
}
