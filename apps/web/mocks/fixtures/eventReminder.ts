import { faker } from "@faker-js/faker";

import type { GetEventReminderSuccessResponse } from "@web/components/Event/EventReminder/EventReminderList/hooks/useGetEventReminder";

const maxLength = faker.number.int({ max: 20, min: 5 });

const getEventReminderDetails = () => {
  return {
    amount: faker.number.int({ max: 10000, min: 100 }),
    city: faker.location.city(),
    contact_no: faker.string.numeric(10),
    date: faker.date.past().toISOString(),
    donation_mode: faker.helpers.arrayElement(["Cash", "Online", "Cheque"]),
    event_master_name: faker.helpers.arrayElement([
      "Mahotsav",
      "Prasadi",
      "Yatra",
    ]),
    event_reminder_date: faker.date.future().toISOString(),
    event_reminder_note: faker.lorem.sentence(),
    full_count: faker.number.int({ max: 10, min: 1 }).toString(),
    receipt_name: faker.person.fullName(),
    receipt_no: `R-${faker.string.numeric(4)}`,
    trust_name: faker.company.name(),
  };
};

export const GET_EVENT_REMINDER_LIST_MOCK_DATA: GetEventReminderSuccessResponse =
  {
    data: {
      eventReminderData: Array.from(
        { length: maxLength },
        getEventReminderDetails
      ),
      totalCount: maxLength,
    },
    message: "Event Reminder list fetched",
  };
