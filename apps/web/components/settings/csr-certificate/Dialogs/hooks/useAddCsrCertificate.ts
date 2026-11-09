import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

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

type AddCsrCertificateApiSuccessResponse =
  ApiSuccessResponse<CsrCertificateFormFieldValues>;

type UseAddCsrCertificateArgs = {
  options: UseMutationOptions<
    AddCsrCertificateApiSuccessResponse,
    ApiErrorResponse<CsrCertificateFormFieldValues>,
    Partial<CsrCertificateApiPayload>
  >;
};

export function useAddCsrCertificate({
  options = {},
}: UseAddCsrCertificateArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddCsrCertificateApiSuccessResponse>(
          CSR_CERTIFICATE_ROUTES.post,
          formValues
        );

      return data;
    },
    mutationKey: csrCertificateKeys.add(),
    ...options,
  });
}
