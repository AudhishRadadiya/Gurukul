import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { DonationImportFormFieldValues } from "@web/components/Donation/donationImport/DonationImportForm";
import { IMPORT_DONATION_ROUTES } from "@web/constants/routes/import_donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationImportKeys } from "@web/queryKeysFactories/donationImport";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

export type DonationImport = {
  aadhar_no: string;
  address: string;
  amount: number;
  atg: boolean;
  bank_name: string;
  cheque_no: string;
  city: string;
  contact_no: string;
  date: string;
  donation_mode: string;
  donation_type: string;
  driving_licence_no: string;
  elector_number: string;
  email: string;
  event_name: string;
  organize_remark: string;
  pan_no: string;
  passport_number: string;
  prasad: boolean;
  receipt_name: string;
  remark: string;
  state: string;
  zip_code: string;
};

export type DonationImportDetails = DonationImport & {
  error?: DonationImport;
};

export type DonationImportApiSuccessResponse = ApiSuccessResponse<{
  erroredData: DonationImportDetails;
}>;

type UseDonationImportArgs = {
  options: UseMutationOptions<
    DonationImportApiSuccessResponse,
    ApiErrorResponse<
      DonationImportFormFieldValues & {
        erroredData: DonationImportDetails[];
      }
    >,
    Partial<
      DonationImportFormFieldValues & {
        donationData: DonationImportDetails[];
      }
    >
  >;
};

export function useDonationImport({ options = {} }: UseDonationImportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<DonationImportApiSuccessResponse>(
          IMPORT_DONATION_ROUTES.post,
          formValues
        );

      return data;
    },
    mutationKey: donationImportKeys.import(),
    ...options,
  });
}
