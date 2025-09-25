import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { ADDRESS_BOOK_ROUTES } from "@web/constants/routes/address_book/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { addressBookKeys } from "@web/queryKeysFactories/addressBook";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type GetAddressBookPayload = {
  pdfUrl: string;
};

export type GetAddressBookPdfApiSuccessResponse =
  ApiSuccessResponse<GetAddressBookPayload>;

type UseGetAddressBookPdfArgs = {
  addressBookIds: string[];
  options: UseMutationOptions<
    GetAddressBookPdfApiSuccessResponse,
    ApiErrorResponse<GetAddressBookPayload>
  >;
};

export function useGetAddressBookPdf({
  addressBookIds,
  options = {},
}: UseGetAddressBookPdfArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.post<GetAddressBookPdfApiSuccessResponse>(
          ADDRESS_BOOK_ROUTES.printAddressBook,
          { address_book_id: addressBookIds }
        );

      return data;
    },
    mutationKey: addressBookKeys.printAddressBook(addressBookIds),
    ...options,
  });
}
