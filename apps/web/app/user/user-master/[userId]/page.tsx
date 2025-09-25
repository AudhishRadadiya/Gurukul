"use client";

import { Card, PadBox } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useQueryState } from "nuqs";

import { EDIT_USER_MASTER } from "@web/app/user/user-master/hooks/constant";
import { EditUserMaster } from "@web/components/user/user-master/EditUserMaster/EditUserMaster";
import { UserMasterBreadcrumbs } from "@web/components/user/user-master/UserMasterBreadcrumbs";

export type PageProps = Readonly<{
  params: {
    userId: string;
  };
}>;

// eslint-disable-next-line import/no-default-export
export default function Page({ params }: PageProps) {
  const { userId } = params;

  const [page] = useQueryState("page");

  const queryPage = page === EDIT_USER_MASTER ? EDIT_USER_MASTER : null;

  return (
    <Stack gap="10px">
      <UserMasterBreadcrumbs page={queryPage} />

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
