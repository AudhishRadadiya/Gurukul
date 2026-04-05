import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { ADDRESS_MISMATCH_ROUTES } from "@web/constants/routes/address_book/address_mismatch/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { updateDonorAddressKeys } from "@web/queryKeysFactories/updateDonorAddress";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import type {
  FilType,
  GetExportPayload,
  GetListArgsAg2,
} from "@web/types/shared-types";

export type GetUpdateDonorAddressExportApiSuccessResponse =
  ApiSuccessResponse<GetExportPayload>;

type ExportMutationVariables = {
  body?: GetListArgsAg2;
  fileType: FilType;
};

type UseGetUpdateDonorAddressExportArgs = {
  options: UseMutationOptions<
    GetUpdateDonorAddressExportApiSuccessResponse,
    ApiErrorResponse<GetExportPayload>,
    ExportMutationVariables
  >;
};

export function useGetUpdateDonorAddressExport({
  options = {},
}: UseGetUpdateDonorAddressExportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetUpdateDonorAddressExportApiSuccessResponse>(
          ADDRESS_MISMATCH_ROUTES.export(fileType),
          body
        );

      return data;
    },
    mutationKey: updateDonorAddressKeys.export(),
    ...options,
  });
}
