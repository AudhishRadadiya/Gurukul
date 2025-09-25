import { http, HttpResponse } from "msw";

import type { GetEventReminderSuccessResponse } from "@web/components/Event/EventReminder/EventReminderList/hooks/useGetEventReminder";
import { EVENT_REMINDER_ROUTES } from "@web/constants/routes/event_reminder/routes";
import { GET_EVENT_REMINDER_LIST_MOCK_DATA } from "@web/mocks/fixtures/eventReminder";

const getEventReminderList = http.post(EVENT_REMINDER_ROUTES.listing, () => {
  return HttpResponse.json<GetEventReminderSuccessResponse>(
    GET_EVENT_REMINDER_LIST_MOCK_DATA,
    { status: 200 }
  );
});

export const eventReminderHandlers = [getEventReminderList];
