"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ContentBox,
  PadBox,
  useDialogActions,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddSuvicharMasterDialog } from "@web/components/settings/suvicharMaster/dialogs/AddSuvicharMasterDialog";
import { SuvicharMasterList } from "@web/components/settings/suvicharMaster/suvicharMasterList/SuvicharMasterList";
import { SUVICHAR_MASTER_PERMISSION } from "@web/constants/permission/settings/suvicharMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { suvicharMasterKeys } from "@web/queryKeysFactories/suvicharMaster";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { isMobile } = useGetDeviceType();

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
    <Stack gap={{ md: "10px", xs: "8px" }}>
      <ContentBox>
        <PadBox padding={{ padding: { md: "10px", xs: "8px 10px" } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="subtitle1"
              fontSize={isMobile ? "16px" : "18px"}
            >
              {t("common.master.label", {
                label: t("suvichar.menu.label"),
              })}
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(SUVICHAR_MASTER_PERMISSION.CREATE)}
            >
              <ButtonLayoutProvider
                variant="outlined"
                size={isMobile ? "small" : "medium"}
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

        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <SuvicharMasterList />
        </Box>
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
