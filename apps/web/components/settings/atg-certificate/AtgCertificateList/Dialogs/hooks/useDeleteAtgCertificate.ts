import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { AtgCertificate } from "@web/components/settings/atg-certificate/AtgCertificateList/hooks/useGetAtgCertificate";
import { ATG_CERTIFICATE_ROUTES } from "@web/constants/routes/atg_certificate/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { atgCertificateKeys } from "@web/queryKeysFactories/atgCertificate";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type DeleteAtgCertificateApiResponse = ApiSuccessResponse<AtgCertificate>;

type UseDeleteAtgCertificateArgs = {
  certificateId: string;
  options: UseMutationOptions<
    DeleteAtgCertificateApiResponse,
    ApiErrorResponse
  >;
};

export function useDeleteAtgCertificate({
  certificateId,
  options = {},
}: UseDeleteAtgCertificateArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteAtgCertificateApiResponse>(
          ATG_CERTIFICATE_ROUTES.delete(certificateId)
        );

      return data;
    },
    mutationKey: atgCertificateKeys.delete(certificateId),
    ...options,
  });
}
