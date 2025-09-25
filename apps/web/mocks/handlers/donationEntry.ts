import { faker } from "@faker-js/faker";
import { http, HttpResponse } from "msw";

import { DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { buildApiUrl } from "@web/mocks/constants/mockApiEndpoints";
import {
  EDIT_DONATION_ENTRY_MOCK_DATA,
  GET_DONATION_ENTRY_MOCK_DATA,
} from "@web/mocks/fixtures/donationEntry";

const getDonationEntry = http.patch(
  buildApiUrl(DONATION_ROUTES.get(faker.string.uuid())),
  () => {
    return HttpResponse.json(GET_DONATION_ENTRY_MOCK_DATA, { status: 200 });
  }
);

const editDonationEntry = http.patch(
  buildApiUrl(DONATION_ROUTES.patch(faker.string.uuid())),
  () => {
    return HttpResponse.json(EDIT_DONATION_ENTRY_MOCK_DATA, { status: 200 });
  }
);

export const donationEntryHandlers = [getDonationEntry, editDonationEntry];
