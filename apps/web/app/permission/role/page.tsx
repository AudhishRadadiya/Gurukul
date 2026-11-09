"use client";

import { ContentBox, PadBox } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import _isEqual from "lodash/isEqual";
import { useRouter } from "next/navigation";
import { parseAsStringEnum, useQueryState } from "nuqs";
import type { ReactNode } from "react";

import {
  RolesPageEnums,
  rolesPage,
  type RolesPageType,
} from "@web/app/permission/role/hooks/constant";
import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddRoles } from "@web/components/permission/role/addRole/AddRole";
import { EditRole } from "@web/components/permission/role/roleList/editRole/EditRole";
import { RoleList } from "@web/components/permission/role/roleList/RoleList";
import { ROLL_ENTRY_PERMISSION } from "@web/constants/permission/permissions/rollEntryAndPermission/permissions";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";

type RolesPageRenderer = Record<RolesPageType, ReactNode>;

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const router = useRouter();

  const { validateAccess } = useUserPermissions();

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

  if (!queryPage || !(queryPage in rolesPage)) {
    router.push("/permission/role?page=list-roles");

    return null;
  }

  return (
    <Stack gap="10px">
      <ContentBox>
        <PadBox padding={{ padding: "20px" }}>
          <Stack gap="20px">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontSize={{ lg: "18px", xs: "16px" }}>
                {queryPage && rolesPage[queryPage]}
              </Typography>

              {isListRoles && (
                <PermissionGuard
                  canAccess={validateAccess(ROLL_ENTRY_PERMISSION.CREATE)}
                >
                  <ButtonLayoutProvider
                    onClick={() =>
                      router.push("/permission/role?page=add-roles")
                    }
                    label={t("common.button.add", {
                      label: t("role.menu.label"),
                    })}
                  />
                </PermissionGuard>
              )}
            </Stack>

            {rolesPageRenderer[queryPage]}
          </Stack>
        </PadBox>
      </ContentBox>
    </Stack>
  );
}
