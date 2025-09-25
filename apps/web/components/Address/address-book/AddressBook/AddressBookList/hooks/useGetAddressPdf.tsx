import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { ADDRESS_BOOK_ROUTES } from "@web/constants/routes/address_book/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { addressBookKeys } from "@web/queryKeysFactories/addressBook";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type GetAddressPayload = {
  pdfUrl: string;
};

export type GetAddressPdfApiSuccessResponse =
  ApiSuccessResponse<GetAddressPayload>;

type UseGetAddressPdfArgs = {
  addressBookIds: string[];
  options: UseMutationOptions<
    GetAddressPdfApiSuccessResponse,
    ApiErrorResponse<GetAddressPayload>
  >;
};

export function useGetAddressPdf({
  addressBookIds,
  options = {},
}: UseGetAddressPdfArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.post<GetAddressPdfApiSuccessResponse>(
        ADDRESS_BOOK_ROUTES.printAddress,
        { address_book_id: addressBookIds }
      );

      return data;
    },
    mutationKey: addressBookKeys.printAddress(addressBookIds),
    ...options,
  });
}
