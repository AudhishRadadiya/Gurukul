"use client";

import { Button, ContentBox, PadBox } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { BranchMasterBreadcrumbs } from "@web/components/settings/branch-master/BranchMasterBreadcrumbs";
import { BranchMasterList } from "@web/components/settings/branch-master/BranchMasterList/BranchMasterList";
import { AddBranchMasterDialog } from "@web/components/settings/branch-master/Dialogs/AddBranchMasterDialog";
import { BRANCH_MASTER_PERMISSION } from "@web/constants/permission/settings/branchMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { branchKeys } from "@web/queryKeysFactories/branch";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { validateAccess } = useUserPermissions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddBranchMasterDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: branchKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <BranchMasterBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              {t("branch.master.menu.label")}
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(BRANCH_MASTER_PERMISSION.CREATE)}
            >
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => {
                  onDialogOpen("add");
                }}
              >
                {t("common.button.add", {
                  label: t("branch.master.menu.label"),
                })}
              </Button>
            </PermissionGuard>
          </Stack>
        </PadBox>

        <BranchMasterList />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
