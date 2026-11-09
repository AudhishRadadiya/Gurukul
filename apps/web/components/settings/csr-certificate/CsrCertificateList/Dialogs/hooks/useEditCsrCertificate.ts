import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { CsrCertificate } from "@web/components/settings/csr-certificate/CsrCertificateList/hooks/useGetCsrCertificate";
import type {
  CsrCertificateApiPayload,
  CsrCertificateFormFieldValues,
} from "@web/components/settings/csr-certificate/Dialogs/CsrCertificateForm";
import { CSR_CERTIFICATE_ROUTES } from "@web/constants/routes/csr_certificate/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { csrCertificateKeys } from "@web/queryKeysFactories/csrCertificate";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type UseEditCsrCertificateArgs = {
  certificateId: string;
  options: UseMutationOptions<
    ApiSuccessResponse<CsrCertificate>,
    ApiErrorResponse<CsrCertificateFormFieldValues>,
    Partial<CsrCertificateApiPayload>
  >;
};

export function useEditCsrCertificate({
  certificateId,
  options = {},
}: UseEditCsrCertificateArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<
        ApiSuccessResponse<CsrCertificate>
      >(CSR_CERTIFICATE_ROUTES.patch(certificateId), formValues);

      return data;
    },
    mutationKey: csrCertificateKeys.edit(certificateId),
    ...options,
  });
}
