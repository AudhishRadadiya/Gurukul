import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRouter } from "next/navigation";

export type TrustBreadcrumbProps = {
  page: "add-trust-master" | "edit-trust-master" | null;
};

export const TrustMasterBreadcrumbs = ({ page }: TrustBreadcrumbProps) => {
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
        page
          ? [
              ...breadcrumbsItems,
              {
                text: `${page === "add-trust-master" ? "Add" : "Edit"} Trust Master`,
              },
            ]
          : breadcrumbsItems
      }
    />
  );
};
