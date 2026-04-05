import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { COMPANY_DETAIL_ROUTES } from "@web/constants/routes/address_book/company_detail/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { businessDetailKeys } from "@web/queryKeysFactories/businessDetail";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import type {
  FilType,
  GetExportPayload,
  GetListArgsAg2,
} from "@web/types/shared-types";

export type GetBusinessDetailExportApiSuccessResponse =
  ApiSuccessResponse<GetExportPayload>;

type ExportMutationVariables = {
  body?: GetListArgsAg2;
  fileType: FilType;
};

type UseGetBusinessDetailExportArgs = {
  options?: UseMutationOptions<
    GetBusinessDetailExportApiSuccessResponse,
    ApiErrorResponse<GetExportPayload>,
    ExportMutationVariables
  >;
};

export function useGetBusinessDetailExport({
  options = {},
}: UseGetBusinessDetailExportArgs = {}) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetBusinessDetailExportApiSuccessResponse>(
          COMPANY_DETAIL_ROUTES.export(fileType),
          body
        );

      return data;
    },
    mutationKey: businessDetailKeys.export(),
    ...options,
  });
}
