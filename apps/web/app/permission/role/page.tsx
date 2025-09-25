"use client";

import {
  Breadcrumbs,
  Button,
  ContentBox,
  PadBox,
  SvgHome,
} from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import _isEqual from "lodash/isEqual";
import { useRouter } from "next/navigation";
import { parseAsStringEnum, useQueryState } from "nuqs";
import type { ReactNode } from "react";

import { AddRoles } from "@web/components/permission/role/addRole/AddRole";
import { EditRole } from "@web/components/permission/role/roleList/editRole/EditRole";
import { RoleList } from "@web/components/permission/role/roleList/RoleList";

export const rolesPage = {
  "add-roles": "Add Roles",
  "edit-roles": "Edit Roles",
  "list-roles": "Roles List",
} as const;

export type RolesPageType = keyof typeof rolesPage;

export const RolesPageEnums: RolesPageType[] = Object.keys(
  rolesPage
) as RolesPageType[];

export type BreadcrumbItem =
  | { icon: React.ReactElement; onClick: () => void }
  | { onClick?: () => void; text: string };

type RolesPageRenderer = Record<RolesPageType, ReactNode>;

type BreadcrumbsMap = Record<RolesPageType, BreadcrumbItem[]>;

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const router = useRouter();

  const [queryPage] = useQueryState(
    "page",
    parseAsStringEnum<RolesPageType>(RolesPageEnums)
  );

  const [roleId] = useQueryState("id", { defaultValue: "" });

  const rolesPageRenderer: RolesPageRenderer = {
    "add-roles": <AddRoles />,
    "edit-roles": <EditRole roleId={roleId} />,
    "list-roles": <RoleList />,
  };

  const isListRoles = _isEqual(queryPage, "list-roles");

  const baseBreadcrumbs: BreadcrumbItem[] = [
    {
      icon: <SvgHome />,
      onClick: () => router.push("/"),
    },
    {
      text: t("permission.menu.label"),
    },
  ];

  const breadcrumbsMap: BreadcrumbsMap = {
    "add-roles": [
      {
        onClick: () => router.push("/permission/role?page=list-roles"),
        text: rolesPage["list-roles"],
      },
      { text: rolesPage["add-roles"] },
    ],
    "edit-roles": [
      {
        onClick: () => router.push("/permission/role?page=list-roles"),
        text: rolesPage["list-roles"],
      },
      { text: rolesPage["edit-roles"] },
    ],
    "list-roles": [{ text: rolesPage["list-roles"] }],
  };

  const breadcrumbsItems: BreadcrumbItem[] = [
    ...baseBreadcrumbs,
    ...(queryPage ? (breadcrumbsMap[queryPage] ?? []) : []),
  ];

  if (!queryPage || !(queryPage in rolesPage)) {
    router.push("/permission/role?page=list-roles");

    return null;
  }

  return (
    <Stack gap="10px">
      <Breadcrumbs items={breadcrumbsItems} />

      <ContentBox>
        <PadBox padding={{ padding: "20px" }}>
          <Stack gap="20px">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">
                {queryPage && rolesPage[queryPage]}
              </Typography>

              {isListRoles && (
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => router.push("/permission/role?page=add-roles")}
                >
                  {t("common.button.add", {
                    label: t("role.menu.label"),
                  })}
                </Button>
              )}
            </Stack>

            {rolesPageRenderer[queryPage]}
          </Stack>
        </PadBox>
      </ContentBox>
    </Stack>
  );
}
