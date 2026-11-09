"use client";

import { Card, PadBox } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";

import { EditWebUserMaster } from "@web/components/user/web-user-master/EditWebUserMaster/EditWebUserMaster";

export type PageProps = Readonly<{
  params: {
    webUserId: string;
  };
}>;

// eslint-disable-next-line import/no-default-export
export default function Page({ params }: PageProps) {
  const { webUserId } = params;

  return (
    <Stack gap="10px">
      <Card
        heading={t("common.master.label", {
          label: t("common.web.user.label"),
        })}
      >
        <PadBox padding={{ padding: "15px" }}>
          <EditWebUserMaster webUserId={webUserId} />
        </PadBox>
      </Card>
    </Stack>
  );
}
