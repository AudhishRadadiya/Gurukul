"use client";

import {
  Breadcrumbs,
  ContentBox,
  PadBox,
  SvgHome,
} from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { parseAsStringEnum, useQueryState } from "nuqs";
import type { ReactNode } from "react";

import type { BreadcrumbItem } from "@web/app/permission/role/page";
import { AddUserPermissions } from "@web/components/permission/user-permissions/addUserPermissions/AddUserPermissions";
import { EditUserPermissions } from "@web/components/permission/user-permissions/userPermissionsList/editUserPermissions/EditUserPermissions";
import { UserPermissionsList } from "@web/components/permission/user-permissions/userPermissionsList/UserPermissionsList";

export const userPermissionsPage = {
  "add-user-permissions": "Add User Permissions",
  "edit-user-permissions": "Edit User Permissions",
  "list-user-permissions": "User Permissions",
} as const;

export type UserPermissionsType = keyof typeof userPermissionsPage;

export const userPermissionsKeys = Object.keys(
  userPermissionsPage
) as UserPermissionsType[];

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const router = useRouter();

  const [queryPage] = useQueryState(
    "page",
    parseAsStringEnum<UserPermissionsType>(userPermissionsKeys)
  );

  const [userId] = useQueryState("id", { defaultValue: "" });

  const permissionsPageRenderer: Record<UserPermissionsType, ReactNode> = {
    "add-user-permissions": <AddUserPermissions userId={userId} />,
    "edit-user-permissions": <EditUserPermissions userId={userId} />,
    "list-user-permissions": <UserPermissionsList />,
  };

  const baseBreadcrumbs: BreadcrumbItem[] = [
    {
      icon: <SvgHome />,
      onClick: () => router.push("/"),
    },
    {
      text: t("permission.menu.label"),
    },
  ];

  const breadcrumbsMap: Record<UserPermissionsType, BreadcrumbItem[]> = {
    "add-user-permissions": [
      {
        onClick: () =>
          router.push(
            "/permission/user-permissions?page=list-user-permissions"
          ),
        text: userPermissionsPage["list-user-permissions"],
      },
      { text: userPermissionsPage["add-user-permissions"] },
    ],
    "edit-user-permissions": [
      {
        onClick: () =>
          router.push(
            "/permission/user-permissions?page=list-user-permissions"
          ),
        text: userPermissionsPage["list-user-permissions"],
      },
      { text: userPermissionsPage["edit-user-permissions"] },
    ],
    "list-user-permissions": [
      { text: userPermissionsPage["list-user-permissions"] },
    ],
  };

  const breadcrumbsItems: BreadcrumbItem[] = [
    ...baseBreadcrumbs,
    ...(queryPage ? (breadcrumbsMap[queryPage] ?? []) : []),
  ];

  if (!queryPage || !(queryPage in userPermissionsPage)) {
    router.push("/permission/user-permissions?page=list-user-permissions");

    return null;
  }

  return (
    <Stack gap="10px">
      <Breadcrumbs items={breadcrumbsItems} />

      <ContentBox>
        <PadBox padding={{ padding: "20px" }}>
          <Stack gap="20px">
            <Typography variant="h6">
              {queryPage && userPermissionsPage[queryPage]}
            </Typography>

            {permissionsPageRenderer[queryPage]}
          </Stack>
        </PadBox>
      </ContentBox>
    </Stack>
  );
}
