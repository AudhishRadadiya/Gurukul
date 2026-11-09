import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { AtgCertificate } from "@web/components/settings/atg-certificate/AtgCertificateList/hooks/useGetAtgCertificate";
import type {
  AtgCertificateApiPayload,
  AtgCertificateFormFieldValues,
} from "@web/components/settings/atg-certificate/Dialogs/AtgCertificateForm";
import { ATG_CERTIFICATE_ROUTES } from "@web/constants/routes/atg_certificate/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { atgCertificateKeys } from "@web/queryKeysFactories/atgCertificate";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type EditAtgCertificateApiResponse = ApiSuccessResponse<AtgCertificate>;

type UseEditAtgCertificateArgs = {
  certificateId: string;
  options: UseMutationOptions<
    EditAtgCertificateApiResponse,
    ApiErrorResponse<AtgCertificateFormFieldValues>,
    Partial<AtgCertificateApiPayload>
  >;
};

export function useEditAtgCertificate({
  certificateId,
  options = {},
}: UseEditAtgCertificateArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditAtgCertificateApiResponse>(
        ATG_CERTIFICATE_ROUTES.patch(certificateId),
        formValues
      );

      return data;
    },
    mutationKey: atgCertificateKeys.edit(certificateId),
    ...options,
  });
}
