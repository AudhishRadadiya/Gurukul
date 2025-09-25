"use client";

import { Card, PadBox } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useQueryState } from "nuqs";

import { EDIT_TRUST_MASTER } from "@web/app/settings/trust-master/hooks/constant";
import { EditTrustMaster } from "@web/components/settings/trust-master/EditTrustMaster/EditTrustMaster";
import { TrustMasterBreadcrumbs } from "@web/components/settings/trust-master/TrustMasterBreadcrumbs";

export type PageProps = Readonly<{
  params: {
    trustMasterId: string;
  };
}>;

// eslint-disable-next-line import/no-default-export
export default function Page({ params }: PageProps) {
  const { trustMasterId } = params;

  const [page] = useQueryState("page");

  const queryPage = page === EDIT_TRUST_MASTER ? EDIT_TRUST_MASTER : null;

  return (
    <Stack gap="10px">
      <TrustMasterBreadcrumbs page={queryPage} />

      <Card heading="Penalty Rules">
        <PadBox padding={{ padding: "15px" }}>
          <EditTrustMaster trustMasterId={trustMasterId} />
        </PadBox>
      </Card>
    </Stack>
  );
}
