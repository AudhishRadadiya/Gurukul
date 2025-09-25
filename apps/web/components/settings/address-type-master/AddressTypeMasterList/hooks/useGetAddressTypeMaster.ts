import { useQuery } from "@tanstack/react-query";

import { ADDRESS_TYPE_ROUTES } from "@web/constants/routes/address_type/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { addressTypeKeys } from "@web/queryKeysFactories/addressType";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type AddressType = {
  address_type: string;
  address_type_id: string;
  full_count: string;
};

export function useGetAddressTypeMaster(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getAddressType = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        addressTypeDetails: AddressType[];
        totalCount: number;
      }>
    >(ADDRESS_TYPE_ROUTES.listing, body);

    return data.data;
  };

  return useQuery({
    initialData: { addressTypeDetails: [], totalCount: 0 },
    queryFn: () => getAddressType(body),
    queryKey: addressTypeKeys.listing(body),
  });
}
