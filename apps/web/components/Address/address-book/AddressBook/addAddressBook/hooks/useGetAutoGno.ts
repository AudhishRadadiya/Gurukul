import { useQuery } from "@tanstack/react-query";

import { ADDRESS_BOOK_ROUTES } from "@web/constants/routes/address_book/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { addressBookKeys } from "@web/queryKeysFactories/addressBook";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type AutoGno = {
  g_no: number;
};

export function useGetAutoGno() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchAutoGno = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<AutoGno>>(
      ADDRESS_BOOK_ROUTES.autoGno
    );

    return data;
  };

  return useQuery({
    queryFn: fetchAutoGno,
    queryKey: addressBookKeys.autoGno(),
  });
}
