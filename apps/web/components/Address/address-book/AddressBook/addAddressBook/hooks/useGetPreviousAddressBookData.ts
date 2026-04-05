import { useQuery } from "@tanstack/react-query";

import { DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationEntryKeys } from "@web/queryKeysFactories/donationEntry";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetPreviousAddressBookDataArgs = {
  donationId: string;
};

type BusinessDetail = {
  address: string;
  business_name: string;
  city: string;
  email: string;
  id: string;
  pan: string;
  pincode: string;
  state: string;
};

export type PreviousAddressBookData = {
  aadhar_no: string | null;
  address: string | null;
  business_detail: BusinessDetail | null;
  city: string | null;
  contact_no: string | null;
  driving_licence_no: string | null;
  electors_number: string | null;
  email_id: string | null;
  first_name: string | null;
  middle_name: string | null;
  pan_no: string | null;
  passport_no: string | null;
  pincode: string | null;
  surname: string | null;
};

export function useGetPreviousAddressBookData({
  donationId,
}: UseGetPreviousAddressBookDataArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchPreviousAddressBook = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<PreviousAddressBookData>>(
      DONATION_ROUTES.previousContactDetail(donationId)
    );

    return data;
  };

  return useQuery({
    enabled: !!donationId,
    queryFn: fetchPreviousAddressBook,
    queryKey: donationEntryKeys.previousContactDetail(donationId),
  });
}
