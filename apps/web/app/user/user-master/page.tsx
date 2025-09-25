"use client";

import {
  Breadcrumbs,
  Button,
  ContentBox,
  PadBox,
  SvgHome,
} from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import type { ReactNode } from "react";

import {
  ADD_USER_MASTER,
  LIST_USER_MASTER,
} from "@web/app/user/user-master/hooks/constant";
import { AddUserMaster } from "@web/components/user/user-master/AddUserMaster/AddUserMaster";
import { UserMasterList } from "@web/components/user/user-master/UserMasterList/UserMasterList";
import { USER_MASTER_PERMISSION } from "@web/constants/permission/user/userMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";

const userMasterPage = {
  [ADD_USER_MASTER]: "Add User Master",
  [LIST_USER_MASTER]: "User Master",
};

type UserMasterPageType = keyof typeof userMasterPage;

const queryPageEmus = [ADD_USER_MASTER, LIST_USER_MASTER] as const;

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const router = useRouter();

  const { validateAccess } = useUserPermissions();

  const [queryPage] = useQueryState(
    "page",
    parseAsStringLiteral(queryPageEmus).withDefault(LIST_USER_MASTER)
  );

  const isUserMasterList = queryPage === LIST_USER_MASTER;

  const breadcrumbsItems = [
    {
      icon: <SvgHome />,
      onClick: () => {
        router.push("/");
      },
    },
    {
      text: t("common.user.label"),
    },
    ...(!isUserMasterList
      ? [
          {
            onClick: () => {
              router.push("/user/user-master");
            },
            text: t("common.master.label", {
              label: t("common.user.label"),
            }),
          },
        ]
      : [
          {
            text: t("common.master.label", {
              label: t("common.user.label"),
            }),
          },
        ]),
  ];

  const UserMasterPageRenderer: Record<UserMasterPageType, ReactNode> = {
    [ADD_USER_MASTER]: <AddUserMaster />,
    [LIST_USER_MASTER]: <UserMasterList />,
  };

  return (
    <Stack gap="10px">
      <Breadcrumbs
        items={
          !isUserMasterList
            ? [
                ...breadcrumbsItems,
                {
                  text: userMasterPage[queryPage],
                },
              ]
            : breadcrumbsItems
        }
      />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              {t("common.master.label", {
                label: t("common.user.label"),
              })}
            </Typography>

            <Box>
              {isUserMasterList && (
                <PermissionGuard
                  canAccess={validateAccess(USER_MASTER_PERMISSION.CREATE)}
                >
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => {
                      router.push("/user/user-master?page=add-user-master");
                    }}
                  >
                    {t("common.button.add", {
                      label: t("common.master.label", {
                        label: t("common.user.label"),
                      }),
                    })}
                  </Button>
                </PermissionGuard>
              )}
            </Box>
          </Stack>
        </PadBox>

        {isUserMasterList ? (
          UserMasterPageRenderer[LIST_USER_MASTER]
        ) : (
          <PadBox padding={{ padding: "15px" }}>
            {UserMasterPageRenderer[queryPage]}
          </PadBox>
        )}
      </ContentBox>
    </Stack>
  );
}
