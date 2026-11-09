"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ContentBox,
  PadBox,
  useDialogActions,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddMasterEntryDialog } from "@web/components/settings/masterEntry/dialogs/AddMasterEntryDialog";
import { MasterEntryList } from "@web/components/settings/masterEntry/masterEntryList/MasterEntryList";
import { MASTER_PARAMETER_PERMISSION } from "@web/constants/permission/settings/masterParameter/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";

export type MasterEntryListRef = {
  refreshMasterEntryList: () => void;
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { isMobile } = useGetDeviceType();

  const { validateAccess } = useUserPermissions();

  const masterEntryListRef = useRef<MasterEntryListRef>(null);

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddMasterEntryDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() =>
          masterEntryListRef.current?.refreshMasterEntryList()
        }
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
              {t("address.master.entry.menu.label")}
            </Typography>

            <PermissionGuard
              canAccess={validateAccess(MASTER_PARAMETER_PERMISSION.CREATE)}
            >
              <ButtonLayoutProvider
                variant="outlined"
                onClick={() => {
                  onDialogOpen("add");
                }}
                label={t("common.button.add", {
                  label: t("address.master.entry.menu.label"),
                })}
              />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <MasterEntryList ref={masterEntryListRef} />
        </Box>
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
