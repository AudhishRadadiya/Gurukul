"use client";

import { ContentBox, PadBox } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddMasterTypeDialog } from "@web/components/settings/master-type/Dialogs/AddMasterTypeDialog";
import { MasterTypeBreadcrumbs } from "@web/components/settings/master-type/MasterTypeBreadcrumbs";
import { MasterTypeList } from "@web/components/settings/master-type/MasterTypeList/MasterTypeList";
import { MASTER_TYPE_PERMISSION } from "@web/constants/permission/settings/masterType/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { masterTypeKeys } from "@web/queryKeysFactories/masterType";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const queryClient = useQueryClient();

  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddMasterTypeDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: masterTypeKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <MasterTypeBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              {t("master.type.menu.label")}
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(MASTER_TYPE_PERMISSION.CREATE)}
            >
              <ButtonLayoutProvider
                variant="outlined"
                onClick={() => {
                  onDialogOpen("add");
                }}
                label={t("common.button.add", {
                  label: t("master.type.menu.label"),
                })}
              />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <MasterTypeList />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
