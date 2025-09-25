import { faker } from "@faker-js/faker";

import type {
  GetSMSMasterSuccessResponse,
  SMSMaster,
} from "@web/components/settings/sms-master/smsMasterList/hooks/useGetSMSMaster";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

const maxLength = faker.number.int({ max: 20, min: 5 });

const getSMSMasterDetails = () => {
  return {
    full_count: faker.string.numeric(1),
    is_active: faker.datatype.boolean(),
    is_deleted: faker.datatype.boolean(),
    sms_master_id: faker.string.uuid(),
    sms_name:
      faker.lorem.words({ max: 2, min: 1 }) +
      faker.helpers.arrayElement(["!", "!!", "?", "?!", "???", "!?!!"]),
  };
};

export const GET_SMS_MASTER_MOCK_DATA: ApiSuccessResponse<SMSMaster> = {
  data: getSMSMasterDetails(),
  message: "SMS Master Get successfully.",
};

export const GET_ALL_SMS_MASTER_MOCK_DATA: GetSMSMasterSuccessResponse = {
  data: {
    smsMasterDetail: Array.from({ length: maxLength }, getSMSMasterDetails),
    totalCount: maxLength,
  },
  message: "SMS Master fetched successfully.",
};
