"use client";

import { ContentBox, PadBox, useGetDeviceType } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { CsrCertificateList } from "@web/components/settings/csr-certificate/CsrCertificateList/CsrCertificateList";
import { AddCsrCertificateDialog } from "@web/components/settings/csr-certificate/Dialogs/AddCsrCertificateDialog";
import { CSR_CERTIFICATE_PERMISSION } from "@web/constants/permission/settings/csrCertificate/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { csrCertificateKeys } from "@web/queryKeysFactories/csrCertificate";
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
      <AddCsrCertificateDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: csrCertificateKeys.listing(),
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
              {t("csr.certificate.title")}
            </Typography>
            <PermissionGuard
              canAccess={validateAccess(CSR_CERTIFICATE_PERMISSION.CREATE)}
            >
              <ButtonLayoutProvider
                variant="outlined"
                onClick={() => onDialogOpen("add")}
                label={t("common.button.add", {
                  label: t("csr.certificate.title"),
                })}
              />
            </PermissionGuard>
          </Stack>
        </PadBox>
        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <CsrCertificateList />
        </Box>
      </ContentBox>
      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
