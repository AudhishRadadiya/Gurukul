import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { AddressImportFormFieldValues } from "@web/components/Address/addressImport/AddressImportForm";
import { IMPORT_ADDRESS_ROUTES } from "@web/constants/routes/address_book/import_address/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { addressImportKeys } from "@web/queryKeysFactories/addressImport";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

export type AddressImport = {
  address: string;
  alternet_mobile_no: string;
  anniversary_date: string;
  birth_date: string;
  city: string;
  contact_no: string;
  district: string;
  email_id: string;
  first_name: string;
  landmark: string;
  middle_name: string;
  pan_no: string;
  pincode: string;
  surname: string;
  taluko: string;
  village: string;
};

export type AddressImportDetails = AddressImport & {
  error?: AddressImport;
};

export type AddressImportApiSuccessResponse = ApiSuccessResponse<{
  erroredData: AddressImportDetails;
}>;

type UseAddressImportArgs = {
  options: UseMutationOptions<
    AddressImportApiSuccessResponse,
    ApiErrorResponse<
      AddressImportFormFieldValues & {
        erroredData: AddressImportDetails[];
      }
    >,
    Partial<
      AddressImportFormFieldValues & {
        address_book: AddressImportDetails[];
      }
    >
  >;
};

export function useAddressImport({ options = {} }: UseAddressImportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddressImportApiSuccessResponse>(
        IMPORT_ADDRESS_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: addressImportKeys.import(),
    ...options,
  });
}
