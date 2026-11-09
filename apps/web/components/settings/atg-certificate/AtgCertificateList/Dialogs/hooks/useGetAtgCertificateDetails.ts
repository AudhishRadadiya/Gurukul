import { useQuery } from "@tanstack/react-query";

import type { AtgCertificate } from "@web/components/settings/atg-certificate/AtgCertificateList/hooks/useGetAtgCertificate";
import { ATG_CERTIFICATE_ROUTES } from "@web/constants/routes/atg_certificate/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { atgCertificateKeys } from "@web/queryKeysFactories/atgCertificate";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type AtgCertificateDetails = {
  certificate_id: string;
  certificate_pdf: string;
  financial_year_id: string[];
  tax_adj_number: string;
  trust_id: string;
};

type UseGetAtgCertificateDetailsArgs = {
  certificateId: AtgCertificate["certificate_id"];
};

type AtgCertificateApiSuccessResponse =
  ApiSuccessResponse<AtgCertificateDetails>;

export function useGetAtgCertificateDetails({
  certificateId,
}: UseGetAtgCertificateDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchAtgCertificateDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<AtgCertificateApiSuccessResponse>(
      ATG_CERTIFICATE_ROUTES.get(certificateId)
    );

    return data;
  };

  return useQuery({
    enabled: !!certificateId,
    queryFn: fetchAtgCertificateDetails,
    queryKey: atgCertificateKeys.get(certificateId),
  });
}
