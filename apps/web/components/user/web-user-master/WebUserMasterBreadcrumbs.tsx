import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ADD_WEB_USER_MASTER,
  EDIT_WEB_USER_MASTER,
} from "@web/app/user/web-user-master/hooks/constant";

export const WebUserMasterBreadcrumbs = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const page = searchParams.get("page");

  const webUserMasterPage =
    page === ADD_WEB_USER_MASTER || page === EDIT_WEB_USER_MASTER ? page : null;

  const breadcrumbsItems = [
    {
      icon: <SvgHome />,
      onClick: () => router.push("/"),
    },
    {
      text: t("common.user.label"),
    },
    {
      ...(webUserMasterPage && {
        onClick: () => {
          router.push("/user/web-user-master");
        },
      }),
      text: t("common.master.label", {
        label: t("common.web.user.label"),
      }),
    },
  ];

  return (
    <Breadcrumbs
      items={
        webUserMasterPage
          ? [
              ...breadcrumbsItems,
              {
                text: `${webUserMasterPage === ADD_WEB_USER_MASTER ? "Add" : "Edit"} Web User Master`,
              },
            ]
          : breadcrumbsItems
      }
    />
  );
};
