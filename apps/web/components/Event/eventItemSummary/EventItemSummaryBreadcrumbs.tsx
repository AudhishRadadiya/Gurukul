import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRouter } from "next/navigation";

export const EventItemSummaryBreadcrumbs = () => {
  const router = useRouter();

  return (
    <Breadcrumbs
      items={[
        {
          icon: <SvgHome />,
          onClick: () => {
            router.push("/");
          },
        },
        {
          text: t("common.event.label"),
        },
        {
          text: t("summary.label", {
            label: t("common.event.item.label"),
          }),
        },
      ]}
    />
  );
};
