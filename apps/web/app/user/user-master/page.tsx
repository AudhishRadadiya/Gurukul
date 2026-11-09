"use client";

import {
  ContentBox,
  PadBox,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import type { ReactNode } from "react";

import { ADD_USER_MASTER } from "@web/app/user/user-master/hooks/constant";
import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddUserMaster } from "@web/components/user/user-master/AddUserMaster/AddUserMaster";
import { UserMasterList } from "@web/components/user/user-master/UserMasterList/UserMasterList";
import { USER_MASTER_PERMISSION } from "@web/constants/permission/user/userMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";

const userMasterPage = {
  [ADD_USER_MASTER]: "Add User Master",
};

type UserMasterPageType = keyof typeof userMasterPage;

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const router = useRouter();

  const [page] = useQueryState("page");

  const { validateAccess } = useUserPermissions();

  const queryPage = page === ADD_USER_MASTER ? ADD_USER_MASTER : null;

  const selectedAddUserMasterPage = Object.keys(userMasterPage).includes(
    queryPage ?? ""
  );

  const UserMasterPageRenderer: Record<UserMasterPageType, ReactNode> = {
    [ADD_USER_MASTER]: <AddUserMaster />,
  };

  return (
    <Stack gap="10px">
      <ContentBox>
        <PadBox padding={{ padding: { sm: "10px", xs: "8px 10px" } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontSize={{ lg: "18px", xs: "16px" }}>
              {t("common.master.label", {
                label: t("common.user.label"),
              })}
            </Typography>

            <Box>
              {!selectedAddUserMasterPage && (
                <PermissionGuard
                  canAccess={validateAccess(USER_MASTER_PERMISSION.CREATE)}
                >
                  <ButtonLayoutProvider
                    onClick={() => {
                      router.push("/user/user-master?page=add-user-master");
                    }}
                    label={t("common.button.add", {
                      label: t("common.master.label", {
                        label: t("common.user.label"),
                      }),
                    })}
                  />
                </PermissionGuard>
              )}
            </Box>
          </Stack>
        </PadBox>

        {selectedAddUserMasterPage ? (
          <PadBox padding={{ padding: "15px" }}>
            {queryPage && UserMasterPageRenderer[queryPage]}
          </PadBox>
        ) : (
          <UserMasterList />
        )}
      </ContentBox>
    </Stack>
  );
}
