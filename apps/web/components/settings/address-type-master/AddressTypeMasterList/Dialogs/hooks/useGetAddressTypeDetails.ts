import { useQuery } from "@tanstack/react-query";

import type { AddressType } from "@web/components/settings/address-type-master/AddressTypeMasterList/hooks/useGetAddressTypeMaster";
import { ADDRESS_TYPE_ROUTES } from "@web/constants/routes/address_type/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { addressTypeKeys } from "@web/queryKeysFactories/addressType";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetAddressTypeDetailsArgs = {
  addressTypeId: AddressType["address_type_id"];
};

export function useGetAddressTypeDetails({
  addressTypeId,
}: UseGetAddressTypeDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchAddressTypeDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<AddressType>>(
      ADDRESS_TYPE_ROUTES.get(addressTypeId)
    );

    return data;
  };

  return useQuery({
    enabled: !!addressTypeId,
    queryFn: fetchAddressTypeDetails,
    queryKey: addressTypeKeys.get(addressTypeId),
  });
}
