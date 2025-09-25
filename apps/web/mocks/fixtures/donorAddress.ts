import { faker } from "@faker-js/faker";

import type { GetDonorAddressSuccessResponse } from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useGetDonorAddress";

const maxLength = faker.number.int({ max: 20, min: 5 });

const getDonorAddressDetails = () => {
  return {
    address: faker.location.streetAddress(),
    checkAll: false,
    city: faker.location.city(),
    contact_id: faker.string.uuid(),
    contact_no: faker.phone.number(),
    donation_id: faker.string.uuid(),
    email_id: faker.internet.email(),
    first_name: faker.person.firstName(),
    full_count: maxLength.toString(),
    is_ignored: faker.datatype.boolean(),
    middle_name: faker.person.middleName(),
    pan_no:
      faker.string.alpha({ length: 5 }).toUpperCase() +
      faker.string.numeric(4) +
      faker.string.alpha({ length: 1 }).toUpperCase(),
    selected: false,
    selectedRecords: {},
    surname: faker.person.lastName(),
  };
};

export const GET_DONOR_ADDRESS_LIST_MOCK_DATA: GetDonorAddressSuccessResponse =
  {
    data: {
      donorAddressList: Array.from(
        { length: maxLength },
        getDonorAddressDetails
      ),
      totalCount: maxLength,
    },
    message: "Donation address list fetched",
  };
