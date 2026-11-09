import { useQuery } from "@tanstack/react-query";

import { CSR_CERTIFICATE_ROUTES } from "@web/constants/routes/csr_certificate/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { csrCertificateKeys } from "@web/queryKeysFactories/csrCertificate";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type CsrCertificate = {
  branch_name: string;
  certificate_id: string;
  financial_year: string;
  full_count: string;
  trust_name: string;
};

type CsrCertificateApiSuccessResponse = ApiSuccessResponse<{
  certificateDetails: CsrCertificate[];
  totalCount: number;
}>;

export function useGetCsrCertificate(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getCsrCertificate = async (requestBody: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<CsrCertificateApiSuccessResponse>(
      CSR_CERTIFICATE_ROUTES.listing,
      requestBody
    );

    return data.data;
  };

  return useQuery({
    initialData: { certificateDetails: [], totalCount: 0 },
    queryFn: () => getCsrCertificate(body),
    queryKey: csrCertificateKeys.listing(body),
  });
}
