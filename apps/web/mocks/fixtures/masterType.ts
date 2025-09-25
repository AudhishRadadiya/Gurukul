import { faker } from "@faker-js/faker";

import type { AddMasterTypeApiSuccessResponse } from "@web/components/settings/master-type/Dialogs/hooks/useAddMasterType";
import type { EditMasterTypeApiResponse } from "@web/components/settings/master-type/MasterTypeList/Dialogs/hooks/useEditMasterType";
import type { GetMasterTypeSuccessResponse } from "@web/components/settings/master-type/MasterTypeList/hooks/useGetMasterType";

const maxLength = faker.number.int({ max: 20, min: 5 });

const getMasterParameterDetails = () => {
  return {
    full_count: maxLength.toString(),
    master_type: faker.string.alpha(10),
    master_type_id: faker.string.uuid(),
  };
};

export const GET_MASTER_TYPE_MOCK_DATA: GetMasterTypeSuccessResponse = {
  data: {
    masterParameterDetails: Array.from(
      { length: maxLength },
      getMasterParameterDetails
    ),
    totalCount: maxLength,
  },
  message: "Master parameter fetched successfully.",
};

export const ADD_MASTER_TYPE_MOCK_DATA: AddMasterTypeApiSuccessResponse = {
  data: null,
  message: "Master type created successfully.",
};

export const EDIT_MASTER_TYPE_MOCK_DATA: EditMasterTypeApiResponse = {
  data: null,
  message: "Master type updated successfully.",
};
