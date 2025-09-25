"use client";

import { Button, ContentBox, PadBox } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

import { AddressTypeBreadcrumbs } from "@web/components/settings/address-type-master/AddressTypeBreadcrumbs";
import { AddressTypeMasterList } from "@web/components/settings/address-type-master/AddressTypeMasterList/AddressTypeMasterList";
import { AddAddressTypeDialog } from "@web/components/settings/address-type-master/Dialogs/AddAddressTypeDialog";
import { ADDRESS_TYPE_PERMISSION } from "@web/constants/permission/settings/addressType/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { addressTypeKeys } from "@web/queryKeysFactories/addressType";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { validateAccess } = useUserPermissions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddAddressTypeDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: addressTypeKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <AddressTypeBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">Address Type</Typography>

            <PermissionGuard
              canAccess={validateAccess(ADDRESS_TYPE_PERMISSION.CREATE)}
            >
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => {
                  onDialogOpen("add");
                }}
              >
                Add Address Type
              </Button>
            </PermissionGuard>
          </Stack>
        </PadBox>

        <AddressTypeMasterList />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
