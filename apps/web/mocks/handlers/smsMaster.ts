import { faker } from "@faker-js/faker";
import { http, HttpResponse } from "msw";

import type { GetSMSMasterSuccessResponse } from "@web/components/settings/sms-master/smsMasterList/hooks/useGetSMSMaster";
import { SMS_MASTER_ROUTES } from "@web/constants/routes/sms_master/routes";
import { buildApiUrl } from "@web/mocks/constants/mockApiEndpoints";
import {
  GET_ALL_SMS_MASTER_MOCK_DATA,
  GET_SMS_MASTER_MOCK_DATA,
} from "@web/mocks/fixtures/smsMaster";

const getSMSMaster = http.patch(
  buildApiUrl(SMS_MASTER_ROUTES.patch(faker.string.uuid())),
  () => {
    return HttpResponse.json(GET_SMS_MASTER_MOCK_DATA, { status: 200 });
  }
);

const getAllMasterType = http.post(
  buildApiUrl(SMS_MASTER_ROUTES.listing),
  () => {
    return HttpResponse.json<GetSMSMasterSuccessResponse>(
      GET_ALL_SMS_MASTER_MOCK_DATA,
      { status: 200 }
    );
  }
);

export const smsMasterHandlers = [getSMSMaster, getAllMasterType];
