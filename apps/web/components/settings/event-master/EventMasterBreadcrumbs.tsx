import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRouter } from "next/navigation";

export type EventMasterBreadcrumbsProps = {
  page: "add-event-master" | "edit-event-master" | null;
};

export const EventMasterBreadcrumbs = ({
  page,
}: EventMasterBreadcrumbsProps) => {
  const router = useRouter();

  const breadcrumbsItems = [
    {
      icon: <SvgHome />,
      onClick: () => router.push("/"),
    },
    {
      text: t("setting.menu.label"),
    },
    {
      ...(page && {
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
        page
          ? [
              ...breadcrumbsItems,
              {
                text: `${page === "add-event-master" ? "Add" : "Edit"} Event Master`,
              },
            ]
          : breadcrumbsItems
      }
    />
  );
};
