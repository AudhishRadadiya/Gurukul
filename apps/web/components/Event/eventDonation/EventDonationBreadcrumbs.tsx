import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRouter } from "next/navigation";

export const EventDonationBreadcrumbs = () => {
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
          onClick: () => {
            router.push("/event/event-summary");
          },
          text: t("summary.label", {
            label: t("common.event.label"),
          }),
        },
        {
          text: t("common.event.wise.donation"),
        },
      ]}
    />
  );
};
