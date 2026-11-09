import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ADD_EVENT_MASTER,
  EDIT_EVENT_MASTER,
} from "@web/app/settings/event-master/hooks/constant";

export const EventMasterBreadcrumbs = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const page = searchParams.get("page");

  const eventMasterPage =
    page === ADD_EVENT_MASTER || page === EDIT_EVENT_MASTER ? page : null;

  const breadcrumbsItems = [
    {
      icon: <SvgHome />,
      onClick: () => router.push("/"),
    },
    {
      text: t("setting.menu.label"),
    },
    {
      ...(eventMasterPage && {
        onClick: () => {
          router.push("/settings/event-master");
        },
      }),
      text: t("common.master.label", {
        label: t("common.event.label"),
      }),
    },
  ];

  return (
    <Breadcrumbs
      items={
        eventMasterPage
          ? [
              ...breadcrumbsItems,
              {
                text: `${eventMasterPage === ADD_EVENT_MASTER ? "Add" : "Edit"} Event Master`,
              },
            ]
          : breadcrumbsItems
      }
    />
  );
};
