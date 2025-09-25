import { useQuery } from "@tanstack/react-query";

import { ADDRESS_BOOK_ROUTES } from "@web/constants/routes/address_book/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { addressBookKeys } from "@web/queryKeysFactories/addressBook";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type AddressBookDetails = {
  address: string;
  address_type: string;
  adhar_no: string;
  alternet_mobile_no: string;
  anniversary_date: string;
  anniversary_day: string;
  b_note: string;
  bday: string;
  birth_date: string;
  blood_group: string;
  business_name: string;
  business_parameter_id: string;
  category1_name: string;
  category2_name: string;
  category_1_parameters_id: string;
  category_2_parameters_id: string;
  checkAll: boolean;
  checkbox: boolean;
  city: string;
  class_mate: string;
  class_mate_name: string;
  contact_id: string;
  contact_no: string;
  district: string;
  driving_licence_no: string;
  education_name: string;
  education_parameter_id: string;
  electors_number: string;
  family_member: string;
  first_name: string;
  full_count: string;
  g_no: string;
  gender: string;
  gurukul_name: string;
  gurukul_parameters_id: string;
  hastak1_name: string;
  hastak2_name: string;
  hastak_1_parameter_id: string;
  hastak_2_parameter_id: string;
  id: string;
  is_past_student: boolean;
  is_vip: boolean;
  landmark: string;
  leave_in: string;
  medium: string;
  middle_name: string;
  note: string;
  pan_no: string;
  passport_no: string;
  patrika: boolean;
  pincode: number;
  saint_name: string;
  saints_hastak_parameter_id: string;
  ssc_gurukul: string;
  ssc_gurukul_name: string;
  ssc_year: string;
  surname: string;
  taluko: string;
  village: string;
  zone_name: string;
  zone_parameter_id: string;
};

export type GetAddressBookSuccessResponse = ApiSuccessResponse<{
  addressBookDetails: AddressBookDetails[];
  totalCount: number;
}>;

export function useGetAddress(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getAddressBook = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetAddressBookSuccessResponse>(
      ADDRESS_BOOK_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { addressBookDetails: [], totalCount: 0 },
    queryFn: () => getAddressBook(body),
    queryKey: addressBookKeys.listing(body),
  });
}
