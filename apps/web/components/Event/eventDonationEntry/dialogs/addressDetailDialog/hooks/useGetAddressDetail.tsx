import { useQuery } from "@tanstack/react-query";

import { ADDRESS_BOOK_ROUTES } from "@web/constants/routes/address_book/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { addressBookKeys } from "@web/queryKeysFactories/addressBook";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type AddressDetail = {
  address: string;
  city: string;
  contact_id: string;
  contact_no: string;
  first_name: string;
  full_count: string;
  middle_name: string;
  surname: string;
};

export type GetAddressDetailSuccessResponse = ApiSuccessResponse<{
  addressBookDetails: AddressDetail[];
  totalCount: number;
}>;

export function useGetAddressDetail(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getAddressDetail = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetAddressDetailSuccessResponse>(
      ADDRESS_BOOK_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { addressBookDetails: [], totalCount: 0 },
    queryFn: () => getAddressDetail(body),
    queryKey: addressBookKeys.listing(body),
  });
}
