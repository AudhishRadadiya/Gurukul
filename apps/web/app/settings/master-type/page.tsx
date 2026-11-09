"use client";

import {
  ContentBox,
  PadBox,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddMasterTypeDialog } from "@web/components/settings/master-type/Dialogs/AddMasterTypeDialog";
import { MasterTypeList } from "@web/components/settings/master-type/MasterTypeList/MasterTypeList";
import { MASTER_TYPE_PERMISSION } from "@web/constants/permission/settings/masterType/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { masterTypeKeys } from "@web/queryKeysFactories/masterType";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { isMobile } = useGetDeviceType();

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

        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <MasterTypeList />
        </Box>
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
