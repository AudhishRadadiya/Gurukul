import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ADD_ROLES,
  EDIT_ROLES,
  rolesPage,
} from "@web/app/permission/role/hooks/constant";

export const RoleBreadcrumbs = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const page = searchParams.get("page");

  const roleSubPage =
    page === ADD_ROLES || page === EDIT_ROLES ? page : null;

  const breadcrumbsItems = [
    {
      icon: <SvgHome />,
      onClick: () => router.push("/"),
    },
    {
      text: t("permission.menu.label"),
    },
    {
      ...(roleSubPage && {
        onClick: () => {
          router.push("/permission/role?page=list-roles");
        },
      }),
      text: t("role.menu.label"),
    },
  ];

  return (
    <Breadcrumbs
      items={
        roleSubPage
          ? [
              ...breadcrumbsItems,
              {
                text:
                  roleSubPage === ADD_ROLES
                    ? rolesPage[ADD_ROLES]
                    : rolesPage[EDIT_ROLES],
              },
            ]
          : breadcrumbsItems
      }
    />
  );
};
