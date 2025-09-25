import { useQuery } from "@tanstack/react-query";

import type { Status } from "@web/components/common/Autocomplete/hooks/useGetStatusOptions";
import { DONATION_ADDRESS_LIST_ROUTES } from "@web/constants/routes/donation_address/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donorAddressKeys } from "@web/queryKeysFactories/donorAddress";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2, SelectedRecords } from "@web/types/shared-types";

export type DonorAddress = {
  address: string;
  checkAll: boolean;
  city: string;
  contact_id: string;
  contact_no: string;
  donation_id: string;
  email_id: string;
  first_name: string;
  full_count: string;
  is_ignored: boolean;
  middle_name: string;
  pan_no: string;
  selected: boolean;
  selectedRecords: SelectedRecords;
  surname: string;
};

export type GetDonorAddressSuccessResponse = ApiSuccessResponse<{
  donorAddressList: DonorAddress[];
  totalCount: number;
}>;

type UseGetDonorAddressArgs = GetListArgsAg2 & {
  status: Status;
};

export function useGetDonorAddress(args: UseGetDonorAddressArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const { status, ...body } = args;

  const getDonorAddress = async () => {
    const { data } = await axiosPrivate.post<GetDonorAddressSuccessResponse>(
      DONATION_ADDRESS_LIST_ROUTES.listing(status),
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { donorAddressList: [], totalCount: 0 },
    queryFn: () => getDonorAddress(),
    queryKey: donorAddressKeys.listing(body),
  });
}
