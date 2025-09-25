import { faker } from "@faker-js/faker";
import { http, HttpResponse } from "msw";

import type { GetMasterTypeSuccessResponse } from "@web/components/settings/master-type/MasterTypeList/hooks/useGetMasterType";
import { MASTER_TYPE_ROUTES } from "@web/constants/routes/master_type/routes";
import { buildApiUrl } from "@web/mocks/constants/mockApiEndpoints";
import {
  ADD_MASTER_TYPE_MOCK_DATA,
  EDIT_MASTER_TYPE_MOCK_DATA,
  GET_MASTER_TYPE_MOCK_DATA,
} from "@web/mocks/fixtures/masterType";

const getMasterType = http.post(buildApiUrl(MASTER_TYPE_ROUTES.listing), () => {
  return HttpResponse.json<GetMasterTypeSuccessResponse>(
    GET_MASTER_TYPE_MOCK_DATA,
    { status: 200 }
  );
});

const addMasterType = http.post(buildApiUrl(MASTER_TYPE_ROUTES.post), () => {
  return HttpResponse.json(ADD_MASTER_TYPE_MOCK_DATA, { status: 200 });
});

const editMasterType = http.patch(
  buildApiUrl(MASTER_TYPE_ROUTES.patch(faker.string.uuid())),
  () => {
    return HttpResponse.json(EDIT_MASTER_TYPE_MOCK_DATA, { status: 200 });
  }
);

export const masterTypeHandlers = [
  getMasterType,
  addMasterType,
  editMasterType,
];
