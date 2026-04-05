import { authHandlers } from "@web/mocks/handlers/auth";
import { donationEntryHandlers } from "@web/mocks/handlers/donationEntry";
import { donorAddressHandlers } from "@web/mocks/handlers/donorAddress";
import { eventReminderHandlers } from "@web/mocks/handlers/eventReminder";
import { masterTypeHandlers } from "@web/mocks/handlers/masterType";

export const handlers = [
  ...authHandlers,
  ...masterTypeHandlers,
  ...donorAddressHandlers,
  ...eventReminderHandlers,
  ...donationEntryHandlers,
];
