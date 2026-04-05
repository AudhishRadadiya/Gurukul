import { useQuery } from "@tanstack/react-query";

import { COMPANY_DETAIL_ROUTES } from "@web/constants/routes/address_book/company_detail/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { businessDetailKeys } from "@web/queryKeysFactories/businessDetail";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export type BusinessNameOptionType = OptionsType & {
  address: string | null;
  city: string | null;
  email: string | null;
  pan_no: string | null;
  pincode: string | null;
  state: string | null;
};

type BusinessNameOptionsType = BusinessNameOptionType[];

export function useGetBusinessNameOptions(contactNumber: string) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBusinessNameOption = async (contactNumber: string) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<BusinessNameOptionsType>
    >(COMPANY_DETAIL_ROUTES.options, { contact_number: contactNumber });

    return data.data;
  };

  return useQuery({
    enabled: !!contactNumber,
    initialData: [],
    queryFn: () => fetchBusinessNameOption(contactNumber),
    queryKey: businessDetailKeys.options(contactNumber),
  });
}
