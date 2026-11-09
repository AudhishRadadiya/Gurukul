"use client";

import { Card, PadBox } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";

import { EditTrustMaster } from "@web/components/settings/trust-master/EditTrustMaster/EditTrustMaster";

export type PageProps = Readonly<{
  params: {
    trustMasterId: string;
  };
}>;

// eslint-disable-next-line import/no-default-export
export default function Page({ params }: PageProps) {
  const { trustMasterId } = params;

  return (
    <Stack gap="10px">
      <Card heading="Penalty Rules">
        <PadBox padding={{ padding: "15px" }}>
          <EditTrustMaster trustMasterId={trustMasterId} />
        </PadBox>
      </Card>
    </Stack>
  );
}
