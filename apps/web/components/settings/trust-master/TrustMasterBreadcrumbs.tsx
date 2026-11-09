import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ADD_TRUST_MASTER,
  EDIT_TRUST_MASTER,
} from "@web/app/settings/trust-master/hooks/constant";

export const TrustMasterBreadcrumbs = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const page = searchParams.get("page");

  const trustMasterPage =
    page === ADD_TRUST_MASTER || page === EDIT_TRUST_MASTER ? page : null;

  const breadcrumbsItems = [
    {
      icon: <SvgHome />,
      onClick: () => router.push("/"),
    },
    {
      text: t("setting.menu.label"),
    },
    {
      ...(trustMasterPage && {
        onClick: () => {
          router.push("/settings/trust-master");
        },
      }),
      text: t("common.master.label", {
        label: t("trust.label"),
      }),
    },
  ];

  return (
    <Breadcrumbs
      items={
        trustMasterPage
          ? [
              ...breadcrumbsItems,
              {
                text: `${trustMasterPage === ADD_TRUST_MASTER ? "Add" : "Edit"} Trust Master`,
              },
            ]
          : breadcrumbsItems
      }
    />
  );
};
