import { http, HttpResponse } from "msw";

import type { GetDonorAddressSuccessResponse } from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useGetDonorAddress";
import { DONATION_ADDRESS_LIST_ROUTES } from "@web/constants/routes/donation_address/routes";
import { GET_DONOR_ADDRESS_LIST_MOCK_DATA } from "@web/mocks/fixtures/donorAddress";

const getDonorAddressList = http.post(
  DONATION_ADDRESS_LIST_ROUTES.listing,
  () => {
    return HttpResponse.json<GetDonorAddressSuccessResponse>(
      GET_DONOR_ADDRESS_LIST_MOCK_DATA,
      { status: 200 }
    );
  }
);

export const donorAddressHandlers = [getDonorAddressList];
