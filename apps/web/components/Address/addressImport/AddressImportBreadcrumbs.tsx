import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRouter } from "next/navigation";

export const AddressImportBreadcrumbs = () => {
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
          text: t("address.menu.label"),
        },
        {
          text: t("address.import.label"),
        },
      ]}
    />
  );
};
