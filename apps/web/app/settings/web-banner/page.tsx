"use client";

import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { ContentBox, PadBox, useDialogActions } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddWebBannerDialog } from "@web/components/web-banner/dialogs/AddWebBannerDialog";
import { WebBannerBreadcrumbs } from "@web/components/web-banner/WebBannerBreadcrumbs";
import { WebBannerList } from "@web/components/web-banner/WebBannerList/WebBannerList";
import { WEB_BANNER_PERMISSION } from "@web/constants/permission/settings/webBanner/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { webBannerKeys } from "@web/queryKeysFactories/webBanner";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddWebBannerDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: webBannerKeys.listing(),
          });
        }}
      />
    ),
  };

  return (
    <Stack gap="10px">
      <WebBannerBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">{t("web.banner.label")}</Typography>

            <PermissionGuard
              canAccess={validateAccess(WEB_BANNER_PERMISSION.CREATE)}
            >
              <ButtonLayoutProvider
                variant="outlined"
                onClick={() => {
                  onDialogOpen("add");
                }}
                label={t("common.button.add", {
                  label: t("web.banner.label"),
                })}
              />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <WebBannerList />
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
