import { useQuery } from "@tanstack/react-query";

import type { CsrCertificate } from "@web/components/settings/csr-certificate/CsrCertificateList/hooks/useGetCsrCertificate";
import { CSR_CERTIFICATE_ROUTES } from "@web/constants/routes/csr_certificate/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { csrCertificateKeys } from "@web/queryKeysFactories/csrCertificate";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type CsrCertificateDetails = {
  certificate_id: string;
  certificate_pdf: string;
  csr_number: string;
  financial_year_id: string[];
  trust_id: string;
};

type UseGetCsrCertificateDetailsArgs = {
  certificateId: CsrCertificate["certificate_id"];
};

type CsrCertificateApiSuccessResponse =
  ApiSuccessResponse<CsrCertificateDetails>;

export function useGetCsrCertificateDetails({
  certificateId,
}: UseGetCsrCertificateDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchCsrCertificateDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<CsrCertificateApiSuccessResponse>(
      CSR_CERTIFICATE_ROUTES.get(certificateId)
    );

    return data;
  };

  return useQuery({
    enabled: !!certificateId,
    queryFn: fetchCsrCertificateDetails,
    queryKey: csrCertificateKeys.get(certificateId),
  });
}
