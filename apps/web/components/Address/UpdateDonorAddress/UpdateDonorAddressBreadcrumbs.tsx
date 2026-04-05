import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export const UpdateDonorAddressBreadcrumbs = () => {
  const router = useRouter();

  const { t } = useTranslation();

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
          text: t("address.label"),
        },
        {
          text: `${t("common.update.label")} ${t("common.donor.label", {
            label: t("address.label"),
          })}`,
        },
      ]}
    />
  );
};
