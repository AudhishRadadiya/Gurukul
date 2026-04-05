import { useQuery } from "@tanstack/react-query";

import type { DonationEntryFormFieldValues } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import type { DonationEntry } from "@web/components/Donation/donationEntry/donationEntryList/hooks/useGetDonationEntry";
import { DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationEntryKeys } from "@web/queryKeysFactories/donationEntry";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetDonationEntryDetailsArgs = {
  donationId: DonationEntry["donation_id"];
};

export function useGetDonationEntryDetails({
  donationId,
}: UseGetDonationEntryDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDonationEntryDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<DonationEntryFormFieldValues>
    >(DONATION_ROUTES.get(donationId));

    return data;
  };

  return useQuery({
    enabled: !!donationId,
    queryFn: fetchDonationEntryDetails,
    queryKey: donationEntryKeys.get(donationId),
  });
}
