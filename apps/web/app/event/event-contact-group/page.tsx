"use client";

import { ContentBox, PadBox, useGetDeviceType } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddEventContactGroupDialog } from "@web/components/Event/eventContactGroup/Dialogs/AddEventContactGroupDialog";
import { EventContactGroupList } from "@web/components/Event/eventContactGroup/EventContactGroupList/EventContactGroupList";
import { EVENT_CONTACT_DETAIL_PERMISSION } from "@web/constants/permission/settings/eventContactDetail/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { eventContactDetailKeys } from "@web/queryKeysFactories/eventContactDetail";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { isMobile } = useGetDeviceType();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { validateAccess } = useUserPermissions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddEventContactGroupDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: eventContactDetailKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Stack gap={{ md: "10px", xs: "8px" }}>
      <ContentBox>
        <PadBox padding={{ padding: { md: "10px", xs: "8px 10px" } }}>
          <Stack
            direction="row"
            gap={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="subtitle1"
              fontSize={isMobile ? "16px" : "18px"}
            >
              Event Contact Group
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(EVENT_CONTACT_DETAIL_PERMISSION.CREATE)}
            >
              <ButtonLayoutProvider
                onClick={() => {
                  onDialogOpen("add");
                }}
                label="Add Event Contact Group"
              />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <EventContactGroupList />
        </Box>
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
