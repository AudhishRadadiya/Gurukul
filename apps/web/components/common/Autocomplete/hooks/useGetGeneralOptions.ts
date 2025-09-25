import { useQuery } from "@tanstack/react-query";

import { DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationEntryKeys } from "@web/queryKeysFactories/donationEntry";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export type GeneralModule = "address_book" | "past-entry";

export type GeneralOptionsKey =
  | "city"
  | "contact_no"
  | "first_name"
  | "last_name"
  | "middle_name"
  | "surname"
  | "district"
  | "pincode"
  | "taluko"
  | "village"
  | "landmark";

export type GeneralOptionsSuccessResponse = ApiSuccessResponse<{
  [K in GeneralOptionsKey]: OptionsType[];
}>;

type UseGetGeneralOptionsArg = {
  last_five_days?: boolean;
  module: GeneralModule;
};

export function useGetGeneralOptions(body: UseGetGeneralOptionsArg) {
  const { axiosPrivate } = useAxiosPrivate();

  const getGeneralOptions = async (body: UseGetGeneralOptionsArg) => {
    const { last_five_days, module } = body;

    const { data } = await axiosPrivate.post<GeneralOptionsSuccessResponse>(
      DONATION_ROUTES.options(module),
      { last_five_days }
    );

    return data.data;
  };

  return useQuery({
    initialData: {
      city: [],
      contact_no: [],
      district: [],
      first_name: [],
      landmark: [],
      last_name: [],
      middle_name: [],
      pincode: [],
      surname: [],
      taluko: [],
      village: [],
    },
    queryFn: () => getGeneralOptions(body),
    queryKey: donationEntryKeys.options(body),
  });
}
