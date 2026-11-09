import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { CsrCertificate } from "@web/components/settings/csr-certificate/CsrCertificateList/hooks/useGetCsrCertificate";
import { CSR_CERTIFICATE_ROUTES } from "@web/constants/routes/csr_certificate/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { csrCertificateKeys } from "@web/queryKeysFactories/csrCertificate";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type UseDeleteCsrCertificateArgs = {
  certificateId: string;
  options: UseMutationOptions<
    ApiSuccessResponse<CsrCertificate>,
    ApiErrorResponse
  >;
};

export function useDeleteCsrCertificate({
  certificateId,
  options = {},
}: UseDeleteCsrCertificateArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<
        ApiSuccessResponse<CsrCertificate>
      >(CSR_CERTIFICATE_ROUTES.delete(certificateId));

      return data;
    },
    mutationKey: csrCertificateKeys.delete(certificateId),
    ...options,
  });
}
