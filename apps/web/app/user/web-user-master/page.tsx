"use client";

import { ContentBox, PadBox } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { ADD_WEB_USER_MASTER } from "@web/app/user/web-user-master/hooks/constant";
import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddWebUserMaster } from "@web/components/user/web-user-master/AddWebUserMaster/AddWebUserMaster";
import { WebUserMasterList } from "@web/components/user/web-user-master/WebUserMasterList/WebUserMasterList";
import { WEB_USER_MASTER_PERMISSION } from "@web/constants/permission/user/webUserMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";

const webUserMasterPage = {
  [ADD_WEB_USER_MASTER]: "Add Web User Master",
};

type PageKey = keyof typeof webUserMasterPage;

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const page = searchParams.get("page");

  const { validateAccess } = useUserPermissions();

  const queryPage = page === ADD_WEB_USER_MASTER ? page : null;

  const selectedAddWebUserMasterPage = Object.keys(webUserMasterPage).includes(
    queryPage ?? ""
  );

  const WebUserMasterPageRenderer: Record<PageKey, ReactNode> = {
    [ADD_WEB_USER_MASTER]: <AddWebUserMaster />,
  };

  return (
    <Stack gap="10px">
      <ContentBox>
        <PadBox
          padding={{
            padding: { lg: "15px", sm: "10px", xs: "8px 10px" },
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontSize={{ lg: "18px", xs: "16px" }}>
              {t("common.master.label", {
                label: t("common.web.user.label"),
              })}
            </Typography>

            <Box>
              {!selectedAddWebUserMasterPage && (
                <PermissionGuard
                  canAccess={validateAccess(WEB_USER_MASTER_PERMISSION.CREATE)}
                >
                  <ButtonLayoutProvider
                    onClick={() => {
                      router.push(
                        "/user/web-user-master?page=add-web-user-master"
                      );
                    }}
                    label={t("common.button.add", {
                      label: t("common.master.label", {
                        label: t("common.web.user.label"),
                      }),
                    })}
                  />
                </PermissionGuard>
              )}
            </Box>
          </Stack>
        </PadBox>

        {selectedAddWebUserMasterPage ? (
          <PadBox padding={{ padding: "15px" }}>
            {queryPage && WebUserMasterPageRenderer[queryPage]}
          </PadBox>
        ) : (
          <WebUserMasterList />
        )}
      </ContentBox>
    </Stack>
  );
}
