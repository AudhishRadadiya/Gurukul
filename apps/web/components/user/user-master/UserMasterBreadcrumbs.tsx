import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRouter } from "next/navigation";

export type UserMasterBreadcrumbsProps = {
  page: "add-user-master" | "edit-user-master" | null;
};

export const UserMasterBreadcrumbs = ({ page }: UserMasterBreadcrumbsProps) => {
  const router = useRouter();

  const breadcrumbsItems = [
    {
      icon: <SvgHome />,
      onClick: () => router.push("/"),
    },
    {
      text: t("common.user.label"),
    },
    {
      onClick: () => {
        router.push("/user/user-master");
      },
      text: t("common.master.label", {
        label: t("common.user.label"),
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
                text: `${page === "add-user-master" ? "Add" : "Edit"} User Master`,
              },
            ]
          : breadcrumbsItems
      }
    />
  );
};
