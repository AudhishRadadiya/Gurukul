import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { DONATION_ADDRESS_LIST_ROUTES } from "@web/constants/routes/donation_address/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donorAddressKeys } from "@web/queryKeysFactories/donorAddress";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import type { FilType, GetListArgsAg2 } from "@web/types/shared-types";

type GetDonorAddressExportPayload = {
  url: string;
};

export type GetDonorAddressPDFApiSuccessResponse =
  ApiSuccessResponse<GetDonorAddressExportPayload>;

type ExportMutationVariables = {
  body?: GetListArgsAg2;
  fileType: FilType;
};

type UseAddDonorAddressExportArgs = {
  options?: UseMutationOptions<
    GetDonorAddressPDFApiSuccessResponse,
    ApiErrorResponse<GetDonorAddressExportPayload>,
    ExportMutationVariables
  >;
};

export function useGetDonorAddressExport({
  options = {},
}: UseAddDonorAddressExportArgs = {}) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetDonorAddressPDFApiSuccessResponse>(
          DONATION_ADDRESS_LIST_ROUTES.post(fileType),
          body
        );

      return data;
    },
    mutationKey: donorAddressKeys.export(),
    ...options,
  });
}
