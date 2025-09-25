import { Breadcrumbs, SvgHome } from "@codezee/sixtify-brahma";
import { useRouter } from "next/navigation";

export const FinancialYearMasterBreadcrumbs = () => {
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
          text: "Settings",
        },
        {
          text: "Financial Year Master",
        },
      ]}
    />
  );
};
