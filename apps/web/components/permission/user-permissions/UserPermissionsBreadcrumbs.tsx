import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ADD_USER_PERMISSIONS,
  EDIT_USER_PERMISSIONS,
  userPermissionsPage,
} from "@web/app/permission/user-permissions/hooks/constant";

export const UserPermissionsBreadcrumbs = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const page = searchParams.get("page");

  const userPermissionsSubPage =
    page === ADD_USER_PERMISSIONS || page === EDIT_USER_PERMISSIONS
      ? page
      : null;

  const breadcrumbsItems = [
    {
      icon: <SvgHome />,
      onClick: () => router.push("/"),
    },
    {
      text: t("permission.menu.label"),
    },
    {
      ...(userPermissionsSubPage && {
        onClick: () => {
          router.push(
            "/permission/user-permissions?page=list-user-permissions"
          );
        },
      }),
      text: t("user.permissions.menu.label"),
    },
  ];

  return (
    <Breadcrumbs
      items={
        userPermissionsSubPage
          ? [
              ...breadcrumbsItems,
              {
                text:
                  userPermissionsSubPage === ADD_USER_PERMISSIONS
                    ? userPermissionsPage[ADD_USER_PERMISSIONS]
                    : userPermissionsPage[EDIT_USER_PERMISSIONS],
              },
            ]
          : breadcrumbsItems
      }
    />
  );
};
