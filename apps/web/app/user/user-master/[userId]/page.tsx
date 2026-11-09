"use client";

import { Card, PadBox } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";

import { EditUserMaster } from "@web/components/user/user-master/EditUserMaster/EditUserMaster";

export type PageProps = Readonly<{
  params: {
    userId: string;
  };
}>;

// eslint-disable-next-line import/no-default-export
export default function Page({ params }: PageProps) {
  const { userId } = params;

  return (
    <Stack gap="10px">
      <Card
        heading={t("common.master.label", {
          label: t("common.user.label"),
        })}
      >
        <PadBox padding={{ padding: "15px" }}>
          <EditUserMaster userId={userId} />
        </PadBox>
      </Card>
    </Stack>
  );
}
