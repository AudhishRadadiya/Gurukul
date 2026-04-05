import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";

import { ADDRESS_MISMATCH_ROUTES } from "@web/constants/routes/address_book/address_mismatch/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { updateDonorAddressKeys } from "@web/queryKeysFactories/updateDonorAddress";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import { isBranchFilterEnabled } from "@web/utils/reactQuery";

export type MismatchedAddressList = {
  contact_address: string;
  contact_city: string;
  contact_id: string;
  contact_no: string;
  contact_pincode: number;
  donation_address: string;
  donation_city: string;
  donation_id: string;
  donation_pincode: string;
  first_name: string;
  full_count: string;
  is_ignored?: boolean;
  surname: string;
};

export type GetUpdateDonorAddressSuccessResponse = ApiSuccessResponse<{
  mismatchedAddressList: MismatchedAddressList[];
  totalCount: number;
}>;

type UseGetUpdateDonorAddressArgs = Partial<
  IGetRowsParams & {
    endRow: number;
    externalFilter?: FieldValues;
    is_active: boolean;
    responseFields: string[];
    startRow: number;
  }
>;

export function useGetUpdateDonorAddress(body: UseGetUpdateDonorAddressArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const getUpdateDonorAddress = async () => {
    const { data } =
      await axiosPrivate.post<GetUpdateDonorAddressSuccessResponse>(
        ADDRESS_MISMATCH_ROUTES.listing,
        body
      );

    return data.data;
  };

  return useQuery({
    enabled: isBranchFilterEnabled(body),
    initialData: { mismatchedAddressList: [], totalCount: 0 },
    queryFn: () => getUpdateDonorAddress(),
    queryKey: updateDonorAddressKeys.listing(body),
  });
}
