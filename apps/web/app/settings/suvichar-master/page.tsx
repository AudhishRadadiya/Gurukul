"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { ContentBox, PadBox, useDialogActions } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddSuvicharMasterDialog } from "@web/components/settings/suvicharMaster/dialogs/AddSuvicharMasterDialog";
import { SuvicharMasterBreadcrumbs } from "@web/components/settings/suvicharMaster/SuvicharMasterBreadcrumbs";
import { SuvicharMasterList } from "@web/components/settings/suvicharMaster/suvicharMasterList/SuvicharMasterList";
import { SUVICHAR_MASTER_PERMISSION } from "@web/constants/permission/settings/suvicharMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { suvicharMasterKeys } from "@web/queryKeysFactories/suvicharMaster";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddSuvicharMasterDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: suvicharMasterKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <SuvicharMasterBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              {t("common.master.label", {
                label: t("suvichar.menu.label"),
              })}
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(SUVICHAR_MASTER_PERMISSION.CREATE)}
            >
              <ButtonLayoutProvider
                variant="outlined"
                onClick={() => {
                  onDialogOpen("add");
                }}
                label={t("common.button.add", {
                  label: t("suvichar.menu.label"),
                })}
              />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <SuvicharMasterList />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
