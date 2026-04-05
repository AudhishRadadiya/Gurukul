"use client";

import { ContentBox, PadBox } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddFinancialYearMasterDialog } from "@web/components/settings/financial-year-master/Dialogs/AddFinancialYearMasterDialog";
import { FinancialYearMasterBreadcrumbs } from "@web/components/settings/financial-year-master/FinancialYearMasterBreadcrumbs";
import { FinancialYearMasterList } from "@web/components/settings/financial-year-master/FinancialYearMasterList/FinancialYearMasterList";
import { AC_YEAR_MASTER_PERMISSION } from "@web/constants/permission/settings/acYearMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { financialYearKeys } from "@web/queryKeysFactories/financialYear";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { validateAccess } = useUserPermissions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddFinancialYearMasterDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: financialYearKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <FinancialYearMasterBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">Financial Year Master</Typography>

            <PermissionGuard
              canAccess={validateAccess(AC_YEAR_MASTER_PERMISSION.CREATE)}
            >
              <ButtonLayoutProvider
                variant="outlined"
                onClick={() => {
                  onDialogOpen("add");
                }}
                label="Add Financial Year"
              />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <FinancialYearMasterList />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
