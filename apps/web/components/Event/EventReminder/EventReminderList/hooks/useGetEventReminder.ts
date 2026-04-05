import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";

import { EVENT_REMINDER_ROUTES } from "@web/constants/routes/event_reminder/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventReminderKeys } from "@web/queryKeysFactories/eventReminder";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import { isBranchFilterEnabled } from "@web/utils/reactQuery";

export type EventReminder = {
  amount: number;
  city: string;
  contact_no: string;
  date: string;
  donation_mode: string;
  event_master_name: string;
  event_reminder_date: string;
  event_reminder_note: string;
  full_count: string;
  receipt_name: string;
  receipt_no: string;
  trust_name: string;
};

export type GetEventReminderSuccessResponse = ApiSuccessResponse<{
  eventReminderData: EventReminder[];
  totalCount: number;
}>;

type GetEventReminderListArgs = Partial<
  IGetRowsParams & {
    endRow: number;
    externalFilter?: FieldValues;
    is_active: boolean;
    responseFields: string[];
    startRow: number;
  }
>;

export function useGetEventReminder(body: GetEventReminderListArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const getEventReminder = async (body: GetEventReminderListArgs) => {
    const { data } = await axiosPrivate.post<GetEventReminderSuccessResponse>(
      EVENT_REMINDER_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    enabled: isBranchFilterEnabled(body),
    initialData: {
      eventReminderData: [],
      totalCount: 0,
    },
    queryFn: () => getEventReminder(body),
    queryKey: eventReminderKeys.listing(body),
  });
}
