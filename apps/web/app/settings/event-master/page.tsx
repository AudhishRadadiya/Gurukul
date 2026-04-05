"use client";

import { ContentBox, PadBox } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import type { ReactNode } from "react";

import { ADD_EVENT_MASTER } from "@web/app/settings/event-master/hooks/constant";
import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddEventMaster } from "@web/components/settings/event-master/AddEventMaster/AddEventMaster";
import { EventMasterBreadcrumbs } from "@web/components/settings/event-master/EventMasterBreadcrumbs";
import { EventMasterList } from "@web/components/settings/event-master/EventMasterList/EventMasterList";
import { EVENT_MASTER_PERMISSION } from "@web/constants/permission/settings/eventMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";

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

  const router = useRouter();

  const { validateAccess } = useUserPermissions();

  const queryPage = page === ADD_EVENT_MASTER ? ADD_EVENT_MASTER : null;

  const selectedAddEventMasterPage = Object.keys(eventMasterPage).includes(
    queryPage ?? ""
  );

  return (
    <Stack gap="10px">
      <EventMasterBreadcrumbs page={queryPage} />

      <ContentBox>
        {!selectedAddEventMasterPage && (
          <PadBox padding={{ padding: "10px" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1">
                {t("common.master.label", {
                  label: t("common.event.label"),
                })}
              </Typography>

              <PermissionGuard
                canAccess={validateAccess(EVENT_MASTER_PERMISSION.CREATE)}
              >
                <ButtonLayoutProvider
                  variant="outlined"
                  onClick={() => {
                    router.push("/settings/event-master?page=add-event-master");
                  }}
                  label={t("common.button.add", {
                    label: t("common.event.label"),
                  })}
                />
              </PermissionGuard>
            </Stack>
          </PadBox>
        )}

        {selectedAddEventMasterPage ? (
          queryPage && eventMasterPageRenderer[queryPage]
        ) : (
          <EventMasterList />
        )}
      </ContentBox>
    </Stack>
  );
}
