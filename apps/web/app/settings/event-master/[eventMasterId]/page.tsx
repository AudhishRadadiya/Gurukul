"use client";

import { ContentBox, PadBox } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";

import { EditEventMaster } from "@web/components/settings/event-master/EditEventMaster/EditEventMaster";

export type PageProps = Readonly<{
  params: {
    eventMasterId: string;
  };
}>;

// eslint-disable-next-line import/no-default-export
export default function Page({ params }: PageProps) {
  const { eventMasterId } = params;

  return (
    <Stack gap="10px">
      <ContentBox>
        <PadBox padding={{ padding: "15px" }}>
          <EditEventMaster eventMasterId={eventMasterId} />
        </PadBox>
      </ContentBox>
    </Stack>
  );
}
