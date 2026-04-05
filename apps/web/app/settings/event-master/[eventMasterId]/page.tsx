"use client";

import { ContentBox, PadBox } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useQueryState } from "nuqs";

import { EDIT_EVENT_MASTER } from "@web/app/settings/event-master/hooks/constant";
import { EditEventMaster } from "@web/components/settings/event-master/EditEventMaster/EditEventMaster";
import { EventMasterBreadcrumbs } from "@web/components/settings/event-master/EventMasterBreadcrumbs";

export type PageProps = Readonly<{
  params: {
    eventMasterId: string;
  };
}>;

// eslint-disable-next-line import/no-default-export
export default function Page({ params }: PageProps) {
  const { eventMasterId } = params;

  const [page] = useQueryState("page");

  const queryPage = page === EDIT_EVENT_MASTER ? EDIT_EVENT_MASTER : null;

  return (
    <Stack gap="10px">
      <EventMasterBreadcrumbs page={queryPage} />

      <ContentBox>
        <PadBox padding={{ padding: "15px" }}>
          <EditEventMaster eventMasterId={eventMasterId} />
        </PadBox>
      </ContentBox>
    </Stack>
  );
}
