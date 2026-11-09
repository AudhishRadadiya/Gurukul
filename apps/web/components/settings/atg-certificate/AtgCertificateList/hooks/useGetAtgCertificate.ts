import { useQuery } from "@tanstack/react-query";

import { ATG_CERTIFICATE_ROUTES } from "@web/constants/routes/atg_certificate/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { atgCertificateKeys } from "@web/queryKeysFactories/atgCertificate";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type AtgCertificate = {
  branch_name: string;
  certificate_id: string;
  financial_year: string;
  full_count: string;
  trust_name: string;
};

type AtgCertificateApiSuccessResponse = ApiSuccessResponse<{
  certificateDetails: AtgCertificate[];
  totalCount: number;
}>;

export function useGetAtgCertificate(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getAtgCertificate = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<AtgCertificateApiSuccessResponse>(
      ATG_CERTIFICATE_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { certificateDetails: [], totalCount: 0 },
    queryFn: () => getAtgCertificate(body),
    queryKey: atgCertificateKeys.listing(body),
  });
}
