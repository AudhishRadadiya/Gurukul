"use client";

import {
  ContentBox,
  PadBox,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
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
  const { isMobile } = useGetDeviceType();

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
    <Stack gap={{ md: "10px", xs: "8px" }}>
      <ContentBox>
        <PadBox padding={{ padding: { md: "10px", xs: "8px 10px" } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={1}
          >
            <Typography
              variant="subtitle1"
              fontSize={isMobile ? "16px" : "18px"}
            >
              Address Type
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(ADDRESS_TYPE_PERMISSION.CREATE)}
            >
              <ButtonLayoutProvider
                variant="outlined"
                onClick={() => {
                  onDialogOpen("add");
                }}
                label="Add Address Type"
              />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <AddressTypeMasterList />
        </Box>
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
