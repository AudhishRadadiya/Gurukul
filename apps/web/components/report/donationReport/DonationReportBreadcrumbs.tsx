import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRouter } from "next/navigation";

export const DonationReportBreadcrumbs = () => {
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
          text: t("common.report"),
        },
        {
          text: t("common.generate", {
            label: t("donation.report.menu.label"),
          }),
        },
      ]}
    />
  );
};
