"use client";

import { ContentBox, PadBox } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { useForm } from "react-hook-form";

import type { Status } from "@web/components/common/Autocomplete/hooks/useGetStatusOptions";
import { StatusAutocomplete } from "@web/components/common/Autocomplete/StatusAutocomplete";
import { ACTIVE, ALL, INACTIVE } from "@web/components/common/hooks/constant";
import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { BranchMasterBreadcrumbs } from "@web/components/settings/branch-master/BranchMasterBreadcrumbs";
import { BranchMasterList } from "@web/components/settings/branch-master/BranchMasterList/BranchMasterList";
import { AddBranchMasterDialog } from "@web/components/settings/branch-master/Dialogs/AddBranchMasterDialog";
import { BRANCH_MASTER_PERMISSION } from "@web/constants/permission/settings/branchMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { branchKeys } from "@web/queryKeysFactories/branch";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

export type BranchMasterValues = {
  is_active: Status;
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { validateAccess } = useUserPermissions();

  const queryClient = useQueryClient();

  const { control: isActiveControl, watch: watchIsActive } =
    useForm<BranchMasterValues>({
      defaultValues: {
        is_active: ALL,
      },
    });

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

  const getIsActiveValue = (statusValue: Status): number => {
    if (statusValue === ALL) {
      return 0;
    }

    if (statusValue === ACTIVE) {
      return 1;
    }

    if (statusValue === INACTIVE) {
      return 2;
    }

    return 0;
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

            <Stack direction="row" gap="10px">
              <StatusAutocomplete
                name="is_active"
                control={isActiveControl}
                closeText="Close"
              />

              <PermissionGuard
                canAccess={validateAccess(BRANCH_MASTER_PERMISSION.CREATE)}
              >
                <ButtonLayoutProvider
                  variant="outlined"
                  onClick={() => {
                    onDialogOpen("add");
                  }}
                  label={t("common.button.add", {
                    label: t("branch.master.menu.label"),
                  })}
                />
              </PermissionGuard>
            </Stack>
          </Stack>
        </PadBox>

        <BranchMasterList
          isActive={getIsActiveValue(watchIsActive("is_active"))}
        />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
