import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ADD_USER_MASTER,
  EDIT_USER_MASTER,
} from "@web/app/user/user-master/hooks/constant";

export const UserMasterBreadcrumbs = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const page = searchParams.get("page");

  const userMasterPage =
    page === ADD_USER_MASTER || page === EDIT_USER_MASTER ? page : null;

  const breadcrumbsItems = [
    {
      icon: <SvgHome />,
      onClick: () => router.push("/"),
    },
    {
      text: t("common.user.label"),
    },
    {
      ...(userMasterPage && {
        onClick: () => {
          router.push("/user/user-master");
        },
      }),
      text: t("common.master.label", {
        label: t("common.user.label"),
      }),
    },
  ];

  return (
    <Breadcrumbs
      items={
        userMasterPage
          ? [
              ...breadcrumbsItems,
              {
                text: `${userMasterPage === ADD_USER_MASTER ? "Add" : "Edit"} User Master`,
              },
            ]
          : breadcrumbsItems
      }
    />
  );
};
