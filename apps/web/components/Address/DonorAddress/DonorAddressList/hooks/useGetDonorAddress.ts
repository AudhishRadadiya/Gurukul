import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";

import { DONATION_ADDRESS_LIST_ROUTES } from "@web/constants/routes/donation_address/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donorAddressKeys } from "@web/queryKeysFactories/donorAddress";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { SelectedRecords } from "@web/types/shared-types";
import { isBranchFilterEnabled } from "@web/utils/reactQuery";

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

type UseGetDonorAddressArgs = Partial<
  IGetRowsParams & {
    endRow: number;
    externalFilter?: FieldValues;
    is_active: boolean;
    responseFields: string[];
    startRow: number;
  }
>;

export function useGetDonorAddress(body: UseGetDonorAddressArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const getDonorAddress = async () => {
    const { data } = await axiosPrivate.post<GetDonorAddressSuccessResponse>(
      DONATION_ADDRESS_LIST_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    enabled: isBranchFilterEnabled(body),
    initialData: { donorAddressList: [], totalCount: 0 },
    queryFn: () => getDonorAddress(),
    queryKey: donorAddressKeys.listing(body),
  });
}
