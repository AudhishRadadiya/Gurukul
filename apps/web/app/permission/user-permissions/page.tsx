"use client";

import { ContentBox, PadBox } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { parseAsStringEnum, useQueryState } from "nuqs";
import type { ReactNode } from "react";

import {
  userPermissionsPage,
  userPermissionsPageEnums,
  type UserPermissionsType,
} from "@web/app/permission/user-permissions/hooks/constant";
import { AddUserPermissions } from "@web/components/permission/user-permissions/addUserPermissions/AddUserPermissions";
import { EditUserPermissions } from "@web/components/permission/user-permissions/userPermissionsList/editUserPermissions/EditUserPermissions";
import { UserPermissionsList } from "@web/components/permission/user-permissions/userPermissionsList/UserPermissionsList";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const router = useRouter();

  const [queryPage] = useQueryState(
    "page",
    parseAsStringEnum<UserPermissionsType>(userPermissionsPageEnums)
  );

  const [userId] = useQueryState("id", { defaultValue: "" });

  const [userName] = useQueryState("user_name", { defaultValue: "" });

  const permissionsPageRenderer: Record<UserPermissionsType, ReactNode> = {
    "add-user-permissions": (
      <AddUserPermissions userId={userId} userName={userName} />
    ),
    "edit-user-permissions": <EditUserPermissions userId={userId} />,
    "list-user-permissions": <UserPermissionsList />,
  };

  if (!queryPage || !(queryPage in userPermissionsPage)) {
    router.push("/permission/user-permissions?page=list-user-permissions");

    return null;
  }

  return (
    <Stack gap="10px">
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
