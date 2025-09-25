import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { Status } from "@web/components/common/Autocomplete/hooks/useGetStatusOptions";
import { DONATION_ADDRESS_LIST_ROUTES } from "@web/constants/routes/donation_address/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donorAddressKeys } from "@web/queryKeysFactories/donorAddress";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

export type FilType = "excel" | "pdf";

type GetDonorAddressExportPayload = {
  url: string;
};

export type GetDonorAddressPDFApiSuccessResponse =
  ApiSuccessResponse<GetDonorAddressExportPayload>;

type UseAddDonorAddressExportArgs = {
  options: UseMutationOptions<
    GetDonorAddressPDFApiSuccessResponse,
    ApiErrorResponse<GetDonorAddressExportPayload>,
    FilType
  >;
  status: Status;
};

export function useGetDonorAddressExport({
  options = {},
  status,
}: UseAddDonorAddressExportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (fileType: FilType) => {
      const { data } =
        await axiosPrivate.post<GetDonorAddressPDFApiSuccessResponse>(
          DONATION_ADDRESS_LIST_ROUTES.post(status, fileType),
          {}
        );

      return data;
    },
    mutationKey: donorAddressKeys.add(status),
    ...options,
  });
}
