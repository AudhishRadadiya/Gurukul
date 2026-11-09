import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

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

type AddAtgCertificateApiSuccessResponse =
  ApiSuccessResponse<AtgCertificateFormFieldValues>;

type UseAddAtgCertificateArgs = {
  options: UseMutationOptions<
    AddAtgCertificateApiSuccessResponse,
    ApiErrorResponse<AtgCertificateFormFieldValues>,
    Partial<AtgCertificateApiPayload>
  >;
};

export function useAddAtgCertificate({
  options = {},
}: UseAddAtgCertificateArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddAtgCertificateApiSuccessResponse>(
          ATG_CERTIFICATE_ROUTES.post,
          formValues
        );

      return data;
    },
    mutationKey: atgCertificateKeys.add(),
    ...options,
  });
}
