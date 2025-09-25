import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRouter } from "next/navigation";

export const BankMasterBreadcrumbs = () => {
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
          text: t("bank.menu.label"),
        },
        {
          text: t("common.master.label", {
            label: t("bank.menu.label"),
          }),
        },
      ]}
    />
  );
};
