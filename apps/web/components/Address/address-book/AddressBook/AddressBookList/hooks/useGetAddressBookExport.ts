import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { ADDRESS_BOOK_ROUTES } from "@web/constants/routes/address_book/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { addressBookKeys } from "@web/queryKeysFactories/addressBook";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";
import type { FilType, GetListArgsAg2 } from "@web/types/shared-types";

type GetAddressBookExportPayload = {
  pdfUrl: string;
};

export type GetAddressBookExportApiSuccessResponse =
  ApiSuccessResponse<GetAddressBookExportPayload>;

type ExportMutationVariables = {
  body?: GetListArgsAg2;
  fileType: FilType;
};

type UseGetAddressBookExportArgs = {
  options: UseMutationOptions<
    GetAddressBookExportApiSuccessResponse,
    ApiErrorResponse<GetAddressBookExportPayload>,
    ExportMutationVariables
  >;
};

export function useGetAddressBookExport({
  options = {},
}: UseGetAddressBookExportArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ body, fileType }: ExportMutationVariables) => {
      const { data } =
        await axiosPrivate.post<GetAddressBookExportApiSuccessResponse>(
          ADDRESS_BOOK_ROUTES.export(fileType),
          body
        );

      return data;
    },
    mutationKey: addressBookKeys.export(),
    ...options,
  });
}
