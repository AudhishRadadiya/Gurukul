import { useQuery } from "@tanstack/react-query";

import { ADDRESS_TYPE_ROUTES } from "@web/constants/routes/address_type/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { addressTypeKeys } from "@web/queryKeysFactories/addressType";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export function useGetAddressTypeOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchAddressTypeOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      ADDRESS_TYPE_ROUTES.options
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchAddressTypeOption,
    queryKey: addressTypeKeys.options(),
  });
}
