"use client";

import { Stack } from "@mui/material";
import { useQueryState } from "nuqs";
import type { ReactNode } from "react";

import { ADD_EVENT_MASTER } from "@web/app/settings/event-master/hooks/constant";
import { AddEventMaster } from "@web/components/settings/event-master/AddEventMaster/AddEventMaster";
import { EventMasterTabs } from "@web/components/settings/event-master/Tabs/Tabs";

const eventMasterPage = {
  [ADD_EVENT_MASTER]: "Add Event Master",
};

type EventMasterPageType = keyof typeof eventMasterPage;

const eventMasterPageRenderer: Record<EventMasterPageType, ReactNode> = {
  [ADD_EVENT_MASTER]: <AddEventMaster />,
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const [page] = useQueryState("page");

  const queryPage = page === ADD_EVENT_MASTER ? ADD_EVENT_MASTER : null;

  const selectedAddEventMasterPage = Object.keys(eventMasterPage).includes(
    queryPage ?? ""
  );

  return (
    <Stack gap="10px">
      {selectedAddEventMasterPage ? (
        queryPage && eventMasterPageRenderer[queryPage]
      ) : (
        <EventMasterTabs />
      )}
    </Stack>
  );
}
