"use client";

import { Button, ContentBox, PadBox } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { AddEventMasterDialog } from "@web/components/settings/event-master/Dialogs/AddEventMasterDialog";
import { EventMasterBreadcrumbs } from "@web/components/settings/event-master/EventMasterBreadcrumbs";
import { EventMasterList } from "@web/components/settings/event-master/EventMasterList/EventMasterList";
import { EVENT_MASTER_PERMISSION } from "@web/constants/permission/settings/eventMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { eventKeys } from "@web/queryKeysFactories/event";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const queryClient = useQueryClient();

  const { validateAccess } = useUserPermissions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddEventMasterDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: eventKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <EventMasterBreadcrumbs />

      <ContentBox>
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
              <Stack direction="row" gap="5px">
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    onDialogOpen("add");
                  }}
                >
                  {t("common.button.add", {
                    label: t("common.event.label"),
                  })}
                </Button>
              </Stack>
            </PermissionGuard>
          </Stack>
        </PadBox>

        <EventMasterList />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
